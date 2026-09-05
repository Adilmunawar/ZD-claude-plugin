#!/usr/bin/env node
// PostToolUse: after a vector file is written, remind Claude to run QA. Non-blocking.
const fs = require("fs");
let input = "";
try { input = fs.readFileSync(0, "utf8"); } catch (_) {}
let path = "";
try { path = JSON.parse(input).tool_input?.file_path || ""; } catch (_) {}
if (/\.(shp|gpkg|geojson|kml|kmz)$/i.test(path)) {
  process.stdout.write(`A vector file was written (${path}). Run the geo-data-qa agent (or /zd-gis:qa-vector) on it before delivering or loading it.\n`);
}
process.exit(0);
