#!/usr/bin/env python3
"""Tile-safe raster -> polygon conversion with seam merging and min-area filter.

Usage: python raster_to_polygons.py in.tif out.gpkg --class 1 --tile 2048 --overlap 96 --min-ha 0.05 --utm 32642
Requires: rasterio, shapely>=2, geopandas, numpy. Resumable via <out>.progress.json.
"""
import argparse, json, os, sys
import numpy as np
import rasterio
from rasterio import features, windows
from shapely.geometry import shape, box
from shapely.ops import unary_union
import geopandas as gpd

def tiles(w, h, size, ov):
    for y in range(0, h, size - ov):
        for x in range(0, w, size - ov):
            yield windows.Window(x, y, min(size, w - x), min(size, h - y))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("dst")
    ap.add_argument("--class", dest="cls", type=int, default=1)
    ap.add_argument("--tile", type=int, default=2048); ap.add_argument("--overlap", type=int, default=96)
    ap.add_argument("--min-ha", type=float, default=0.05); ap.add_argument("--utm", type=int, default=32642)
    a = ap.parse_args()
    prog = a.dst + ".progress.json"; tmpdir = a.dst + ".tiles"; os.makedirs(tmpdir, exist_ok=True)
    done = set(json.load(open(prog))) if os.path.exists(prog) else set()
    with rasterio.open(a.src) as ds:
        crs = ds.crs
        for i, win in enumerate(tiles(ds.width, ds.height, a.tile, a.overlap)):
            if i in done: continue
            arr = ds.read(1, window=win); mask = (arr == a.cls).astype(np.uint8)
            if mask.any():
                tr = ds.window_transform(win)
                geoms = [shape(g) for g, v in features.shapes(mask, mask=mask, transform=tr) if v == 1]
                gpd.GeoDataFrame({"tile": i}, geometry=geoms, crs=crs).to_parquet(f"{tmpdir}/{i}.parquet")
            done.add(i); json.dump(sorted(done), open(prog, "w"))
            print(f"tile {i} done", file=sys.stderr)
    parts = [gpd.read_parquet(f"{tmpdir}/{f}") for f in os.listdir(tmpdir) if f.endswith(".parquet")]
    if not parts: print("no polygons"); return
    gdf = gpd.GeoDataFrame(gpd.pd.concat(parts, ignore_index=True), crs=crs)
    # merge across seams: union everything that touches another polygon from a different tile
    sidx = gdf.sindex; touch = set()
    for idx, geom in enumerate(gdf.geometry):
        for j in sidx.query(geom, predicate="intersects"):
            if j != idx and gdf.tile.iloc[j] != gdf.tile.iloc[idx]: touch.add(idx); touch.add(j)
    if touch:
        merged = unary_union(gdf.geometry.iloc[sorted(touch)].values)
        merged = gpd.GeoDataFrame(geometry=[g for g in getattr(merged, "geoms", [merged])], crs=crs)
        gdf = gpd.GeoDataFrame(gpd.pd.concat([gdf.drop(index=sorted(touch)).drop(columns="tile"), merged], ignore_index=True), crs=crs)
    else:
        gdf = gdf.drop(columns="tile")
    gdf["geometry"] = gdf.make_valid(); gdf = gdf[~gdf.is_empty]
    gdf["area_ha"] = gdf.to_crs(a.utm).area / 1e4
    gdf = gdf[gdf.area_ha >= a.min_ha].reset_index(drop=True)
    gdf.to_crs(4326).to_file(a.dst, driver="GPKG")
    print(f"wrote {len(gdf)} polygons, {gdf.area_ha.sum():.1f} ha -> {a.dst}")

if __name__ == "__main__": main()
