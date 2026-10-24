#!/usr/bin/env python3
"""Check rendered page structure and local routes. Python standard library only."""
import json
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
R=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=set();self.refs=[];self.h1=0;self.canon=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:assert a['id'] not in self.ids,'Duplicate id: '+a['id'];self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='link' and a.get('rel')=='canonical':self.canon.append(a.get('href'))
  for name in ['href','src']:
   if a.get(name):self.refs.append(a[name])
routes=json.loads((R/'content/routes.json').read_text());count=0
for pair in routes.values():
 for route in pair.values():
  file=R/route.lstrip('/')/'index.html';page=Page(file.read_text());assert page.h1==1,str(file);assert page.canon==['https://onyx45.com'+route],str(file)
  for ref in page.refs:
   u=urlparse(ref)
   if u.scheme or u.netloc:continue
   target=(R/unquote(u.path).lstrip('/')) if u.path.startswith('/') else file.parent/unquote(u.path)
   if not u.path:target=file
   if target.is_dir():target=target/'index.html'
   assert target.exists(),str(file)+' -> '+ref
   if u.fragment:assert u.fragment in Page(target.read_text()).ids,str(file)+' -> '+ref
  count+=1
assert (R/'CNAME').read_bytes()==b'onyx45.com'
print(f'PASS: {count} localized pages; local routes, assets, fragments, unique IDs, headings, canonicals and CNAME.')
