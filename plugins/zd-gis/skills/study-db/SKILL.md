---
name: study-db
description: Catalog queries and checks for studying a database — Postgres/PostGIS, SQL Server, MySQL, SQLite/GeoPackage. Apply when documenting a schema, finding spatial columns, auditing indexes or diagnosing slow spatial queries. Read-only.
---

# Study a database (read-only)

## Postgres / PostGIS
```sql
-- tables + sizes
SELECT n.nspname AS schema, c.relname AS table, c.reltuples::bigint AS est_rows,
       pg_size_pretty(pg_total_relation_size(c.oid)) AS size
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE c.relkind IN ('r','m') AND n.nspname NOT IN ('pg_catalog','information_schema')
ORDER BY pg_total_relation_size(c.oid) DESC;
-- spatial columns
SELECT f_table_schema, f_table_name, f_geometry_column, type, srid, coord_dimension FROM geometry_columns;
-- missing GIST index on geometry columns
SELECT g.f_table_name, g.f_geometry_column FROM geometry_columns g
WHERE NOT EXISTS (SELECT 1 FROM pg_indexes i WHERE i.tablename=g.f_table_name AND i.indexdef ILIKE '%gist%'||g.f_geometry_column||'%');
-- invalid geometries (sampled)
SELECT count(*) FILTER (WHERE NOT ST_IsValid(geom)) AS invalid, count(*) AS sampled FROM (SELECT geom FROM <table> LIMIT 5000) s;
-- extent
SELECT ST_Extent(geom) FROM <table>;
-- unused indexes
SELECT schemaname, relname, indexrelname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan=0 ORDER BY pg_relation_size(indexrelid) DESC;
-- FKs for ER diagram
SELECT tc.table_name, kcu.column_name, ccu.table_name AS ref_table, ccu.column_name AS ref_col
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name=kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name=tc.constraint_name
WHERE tc.constraint_type='FOREIGN KEY';
```
Slow spatial query checklist: `EXPLAIN (ANALYZE, BUFFERS)`; look for Seq Scan on a geometry table (missing GIST), `ST_Intersects` on unindexed side, `ST_Transform` inside the WHERE (transform the constant instead), `ST_Buffer` in a join (use `ST_DWithin`).

## SQL Server
```sql
SELECT s.name AS [schema], t.name AS [table], p.rows FROM sys.tables t JOIN sys.schemas s ON s.schema_id=t.schema_id JOIN sys.partitions p ON p.object_id=t.object_id AND p.index_id IN (0,1);
SELECT t.name, c.name, ty.name FROM sys.columns c JOIN sys.types ty ON ty.user_type_id=c.user_type_id JOIN sys.tables t ON t.object_id=c.object_id WHERE ty.name IN ('geometry','geography');
SELECT t.name, i.name, i.type_desc FROM sys.indexes i JOIN sys.tables t ON t.object_id=i.object_id WHERE i.type_desc='SPATIAL';
SELECT TOP 5000 geom.STIsValid() AS ok FROM <table>;  -- count ok=0
-- Query Store hotspots (if enabled)
SELECT TOP 20 qt.query_sql_text, rs.avg_duration FROM sys.query_store_query q JOIN sys.query_store_query_text qt ON qt.query_text_id=q.query_text_id JOIN sys.query_store_plan p ON p.query_id=q.query_id JOIN sys.query_store_runtime_stats rs ON rs.plan_id=p.plan_id ORDER BY rs.avg_duration DESC;
```
EF Core notes: check `OnModelCreating` for `.HasColumnType("geometry")`, `UseNetTopologySuite()`, and `HasIndex(..).IsSpatial()`; missing `IsSpatial()` means no spatial index.

## MySQL
`SELECT table_name, column_name, srs_id FROM information_schema.ST_GEOMETRY_COLUMNS;` — spatial index requires an `SRID` attribute on the column.

## SQLite / GeoPackage / SpatiaLite
`ogrinfo -so -al file.gpkg` gives layers, CRS, extent, feature counts. Tables: `gpkg_contents`, `gpkg_geometry_columns`, `gpkg_spatial_ref_sys`. R-tree: `SELECT * FROM gpkg_extensions WHERE extension_name='gpkg_rtree_index'`.

## Output
Write findings to `docs/DATABASE.md` with a Mermaid `erDiagram`, a spatial-columns table (schema, table, column, type, SRID, index yes/no, est rows), and recommendations with DDL.
