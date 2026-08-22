---
name: qa-vector
disable-model-invocation: true
argument-hint: "<file-or-table>"
description: Run the geo-data-qa checks on a vector file or table and print the report.
effort: low
---

Invoke the `geo-data-qa` subagent on `$ARGUMENTS` (a file path or table name; ask if empty). Return its report unchanged, then one line of overall advice.
