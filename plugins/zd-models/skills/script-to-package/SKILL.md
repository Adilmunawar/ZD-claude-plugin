---
name: script-to-package
disable-model-invocation: true
argument-hint: "<script.py>"
description: Turn a constants-at-top pipeline script into a configured, resumable, tested CLI.
---

1. Extract the constants block into a `@dataclass Config` with defaults and a `from_args()`/YAML loader. Keep names identical so results are reproducible.
2. Replace literal tokens/keys/paths with `os.environ[...]` and relative `working_directory` paths; fail fast with a clear message if missing.
3. Wrap the body in `main(cfg)`; make loops resumable with a progress file; add `--dry-run` that prints the plan (chunks, batches) without running.
4. Add `pyproject.toml` entry point `zd-<stage>`, a `tests/test_<stage>.py` with one synthetic-input smoke test, and a README section (inputs, outputs, constants table).
5. Run the original and the new version on a small AOI; diff outputs (counts, total area); report.
