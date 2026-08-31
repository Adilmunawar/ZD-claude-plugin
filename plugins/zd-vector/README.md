# zd-vector

Model output → clean parcel vectors.

| Component | Purpose |
|---|---|
| `vector-engineer` (agent) | Runs the full raster→parcel pipeline with tiling and QA |
| `raster-to-polygons` (auto) + `scripts/raster_to_polygons.py` | RAM-safe polygonisation with seam merge, resumable |
| `topology-repair` (auto) | Invalid/overlap/gap/sliver fixes that keep shared edges |
| `straighten-edges` (auto) | Remove staircase edges on the edge graph |
| `road-subtract` (auto) | OSM/Overture road & canal buffers subtracted |
| `/zd-vector:gap-analysis` | Missing-coverage layer + summary |
