#!/usr/bin/env python3
"""Pre-publish integrity lint for the GLP-1 dashboard data files.

Run from the repo root:  python3 scripts/lint-data.py
Exit code 0 = clean, 1 = at least one FAIL.

The rule that matters most is CORRECTION VISIBILITY. EntryCard renders an entry's
`summary` always but its `content` only when expanded, so a retraction or narrowing
written into `content` alone is invisible by default -- a reader sees the withdrawn
claim and never the correction. That is how a corrected-but-still-wrong tariff rate
shipped once; this lint makes it fail loudly instead.
"""
import json, glob, sys, os

CORRECTION_MARKERS = [
    "CORRECTION APPENDED", "NARROWED", "WAS WRONG", "THAT WAS WRONG",
    "SUPERSEDES", "CORRECTED 2026", "conclusion is withdrawn",
]
SUMMARY_FLAGS = [
    "NARROWED", "CORRECT", "SUPERSEDES", "WITHDRAW", "WRONG", "RECONCILED",
]
MAX_METRIC_LEN = 30

fails, warns = [], []

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
files = sorted(glob.glob('data/*.json'))
section_files = [f for f in files if not f.endswith('meta.json')]

# 0. JSON validity
docs = {}
for fp in files:
    try:
        docs[fp] = json.load(open(fp))
    except Exception as exc:
        fails.append(f"{fp}: INVALID JSON -- {exc}")
if fails:
    print("\n".join("FAIL " + f for f in fails)); sys.exit(1)

meta = docs['data/meta.json']

for fp in section_files:
    d = docs[fp]
    sid = d['meta']['section_id']
    arrays = {k: v for k, v in d.items() if isinstance(v, list)}

    # 1. duplicate IDs
    ids = [it['id'] for v in arrays.values() for it in v if isinstance(it, dict) and 'id' in it]
    dups = sorted({i for i in ids if ids.count(i) > 1})
    if dups:
        fails.append(f"{sid}: duplicate entry IDs {dups}")

    # 2. entry_count
    actual = len(d.get('stories', [])) if sid == 'news-hub' else sum(len(v) for v in arrays.values())
    if d['meta'].get('entry_count') != actual:
        fails.append(f"{sid}: entry_count {d['meta'].get('entry_count')} != actual {actual}")

    # 3. meta.json agreement
    ms = meta['sections'].get(sid)
    if ms is None:
        fails.append(f"{sid}: missing from data/meta.json")
    else:
        for field in ('last_updated', 'entry_count', 'key_metrics'):
            if ms.get(field) != d['meta'].get(field):
                fails.append(f"{sid}: data/meta.json '{field}' out of sync with the section file")

    # 4. key_metrics length (these render as large text and overflow)
    for km in d['meta'].get('key_metrics', []):
        if len(str(km.get('value', ''))) > MAX_METRIC_LEN:
            fails.append(f"{sid}: key_metric {km.get('label')!r} value is "
                         f"{len(str(km['value']))} chars (max {MAX_METRIC_LEN})")

    # 5. CORRECTION VISIBILITY -- the rule this lint exists for
    for v in arrays.values():
        for it in v:
            if not isinstance(it, dict) or 'content' not in it:
                continue
            content, summary = it.get('content') or '', it.get('summary') or ''
            hit = next((m for m in CORRECTION_MARKERS if m in content), None)
            if hit and not any(f in summary.upper() for f in SUMMARY_FLAGS):
                fails.append(
                    f"{sid}/{it.get('id')}: content carries a correction ({hit!r}) but the "
                    f"summary does not flag it. The summary is the only text shown before a "
                    f"reader expands the card, so the withdrawn claim reads as current.")

    # 6. sourcing hygiene
    for v in arrays.values():
        for it in v:
            if not isinstance(it, dict):
                continue
            if 'timestamp' in it and not (it.get('source_url') or it.get('sources')):
                warns.append(f"{sid}/{it.get('id')}: entry has a timestamp but no source_url or sources[]")

for w in warns:
    print("WARN " + w)
for f in fails:
    print("FAIL " + f)
print()
if fails:
    print(f"LINT FAILED -- {len(fails)} error(s), {len(warns)} warning(s)")
    sys.exit(1)
print(f"LINT CLEAN -- {len(section_files)} sections, {len(warns)} warning(s)")
