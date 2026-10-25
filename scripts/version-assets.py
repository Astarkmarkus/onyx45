#!/usr/bin/env python3
"""Create content-addressed browser scripts and update rendered pages; no build required."""
from pathlib import Path
import hashlib,re,json
ROOT=Path(__file__).resolve().parents[1]
versions={}
for source,stem in [('agency-20261023.js','agency'),('site-config.js','site-config'),('agency-20261023.css','agency')]:
 data=(ROOT/'assets'/source).read_bytes()
 name=f'{stem}.{hashlib.sha256(data).hexdigest()[:12]}{Path(source).suffix}'
 (ROOT/'assets'/name).write_bytes(data)
 versions[source]='/assets/'+name
for p in ROOT.rglob('*.html'):
 if any(part in ['dist','.git','.openai'] for part in p.relative_to(ROOT).parts):continue
 text=p.read_text()
 text=re.sub(r'/assets/(?:agency-20261023|agency\.[0-9a-f]{12})\.js(?:\?[^"\s<>]*)?',versions['agency-20261023.js'],text)
 text=re.sub(r'/assets/site-config(?:\.[0-9a-f]{12})?\.js(?:\?[^"\s<>]*)?',versions['site-config.js'],text)
 text=re.sub(r'/assets/(?:agency-20261023|agency\.[0-9a-f]{12})\.css(?:\?[^\"\s<>]*)?',versions['agency-20261023.css'],text)
 p.write_text(text)
(ROOT/'assets/script-versions.json').write_text(json.dumps(versions,indent=2)+'\n')
print('Versioned '+', '.join(versions.values()))
