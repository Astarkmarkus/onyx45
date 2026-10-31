#!/usr/bin/env python3
"""Publish approved multilingual editorial copy to rendered static files. No dependencies."""
import argparse,datetime,html,json,re
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('input',type=Path);a=p.parse_args();data=json.loads(a.input.read_text());root=Path(__file__).resolve().parents[1]
if data.get('approved') is not True:raise SystemExit('Set approved=true only after the copy and publication date are approved.')
slug=data.get('slug','')
if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',slug):raise SystemExit('A lowercase URL slug is required.')
date=datetime.date.fromisoformat(data['published']);langs=['en','sv','es','ca'];listings=json.loads((root/'content/routes.json').read_text())['insights'];urls={l:listings[l]+slug+'/' for l in langs};back={'en':'All insights','sv':'Alla insikter','es':'Todas las ideas','ca':'Totes les idees'};read={'en':'Read article','sv':'Läs artikeln','es':'Leer artículo','ca':'Llegeix l’article'}
for l in langs:
 v=data[l]
 if not all(isinstance(v.get(k),str) and v[k].strip() for k in ['title','description','category']):raise SystemExit('All four languages need title, description and category.')
 if not isinstance(v.get('paragraphs'),list) or not v['paragraphs'] or not all(isinstance(t,str) and t.strip() for t in v['paragraphs']):raise SystemExit('All four languages need approved paragraph text.')
 if (root/urls[l].lstrip('/')/'index.html').exists():raise SystemExit('Article already exists; edit it directly rather than overwriting.')
for l in langs:
 v=data[l];esc=html.escape;source=root/listings[l].lstrip('/')/'index.html';template=source.read_text();main='<main id="main"><article class="wrap section legal-copy"><a class="text-link" href="'+listings[l]+'">'+back[l]+'</a><span class="eyebrow">'+esc(v['category'])+'</span><h1>'+esc(v['title'])+'</h1><time datetime="'+date.isoformat()+'">'+date.isoformat()+'</time><p class="lead">'+esc(v['description'])+'</p>'+''.join('<p>'+esc(t)+'</p>' for t in v['paragraphs'])+'</article></main>'
 out=re.sub(r'<main id="main">.*?</main>',lambda _:main,template,flags=re.S);out=re.sub(r'<title>.*?</title>','<title>'+esc(v['title'])+' | ONYX45</title>',out);out=re.sub(r'<meta name="description"[^>]+>',lambda _:'<meta name="description" content="'+esc(v['description'],quote=True)+'">',out);out=re.sub(r'<meta property="og:(title|description|url|type)"[^>]+>',lambda m:'<meta property="og:'+m[1]+'" content="'+esc({'title':v['title']+' | ONYX45','description':v['description'],'url':'https://onyx45.com'+urls[l],'type':'article'}[m[1]],quote=True)+'">',out);out=re.sub(r'<link rel="canonical"[^>]+>','<link rel="canonical" href="https://onyx45.com'+urls[l]+'">',out);out=re.sub(r'<link rel="alternate" hreflang="(en|sv|es|ca|x-default)"[^>]+>',lambda m:'<link rel="alternate" hreflang="'+m[1]+'" href="https://onyx45.com'+urls['en' if m[1]=='x-default' else m[1]]+'">',out)
 for target_lang in langs:out=re.sub(r'href="[^"]+" lang="'+target_lang+r'" hreflang="'+target_lang+'"',lambda _:f'href="{urls[target_lang]}" lang="{target_lang}" hreflang="{target_lang}"',out)
 dest=root/urls[l].lstrip('/')/'index.html';dest.parent.mkdir(parents=True);dest.write_text(out)
 card='<article class="service-card"><span class="eyebrow">'+esc(v['category'])+'</span><time datetime="'+date.isoformat()+'">'+date.isoformat()+'</time><h2>'+esc(v['title'])+'</h2><p>'+esc(v['description'])+'</p><a class="text-link" href="'+urls[l]+'">'+read[l]+'</a></article>'
 listing=source.read_text();listing=re.sub(r'<div class="editorial-empty">.*?</div>', '<div class="article-list"></div>', listing,flags=re.S);listing=listing.replace('<div class="article-list">','<div class="article-list">'+card,1);source.write_text(listing)
sitemap=root/'sitemap.xml';text=sitemap.read_text();text=text.replace('</urlset>',''.join('<url><loc>https://onyx45.com'+urls[l]+'</loc></url>\n' for l in langs)+'</urlset>');sitemap.write_text(text)
print('Created all four localized article pages, listing cards and sitemap entries. Review before committing.')
