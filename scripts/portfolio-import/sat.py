"""Locate the coloured subject on a slide: technical drawings are grey, renders
and photos are not. Cells scored by mean saturation, largest blob wins."""
import sys, json
from collections import deque
from PIL import Image, ImageFilter
import rebuild as R

def sat_box(p, thr=38, cell=16):
    m = R.page_master(p); m.thumbnail((1500,1500), Image.LANCZOS)
    s = m.convert('HSV').getchannel('S')
    v = m.convert('L')
    # saturated AND not near-black/near-white
    px_s, px_v = s.load(), v.load()
    W,H = m.size
    mask = Image.new('L',(W,H),0); pm = mask.load()
    for y in range(H):
        for x in range(W):
            pm[x,y] = 255 if px_s[x,y] > thr and 25 < px_v[x,y] < 250 else 0
    gw,gh = W//cell, H//cell
    small = mask.resize((gw,gh), Image.BOX).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    ps = small.load()
    grid = [[ps[x,y] >= 0.35*255 for x in range(gw)] for y in range(gh)]
    seen=[[False]*gw for _ in range(gh)]; out=[]
    for y0 in range(gh):
        for x0 in range(gw):
            if not grid[y0][x0] or seen[y0][x0]: continue
            q=deque([(x0,y0)]); seen[y0][x0]=True; cs=[]
            while q:
                x,y=q.popleft(); cs.append((x,y))
                for dx,dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
                    nx,ny=x+dx,y+dy
                    if 0<=nx<gw and 0<=ny<gh and grid[ny][nx] and not seen[ny][nx]:
                        seen[ny][nx]=True; q.append((nx,ny))
            xs=[c[0] for c in cs]; ys=[c[1] for c in cs]
            out.append((len(cs),min(xs)/gw,min(ys)/gh,(max(xs)+1)/gw,(max(ys)+1)/gh))
    out.sort(reverse=True)
    return out[:4]

for spec in sys.argv[1:]:
    n,pg = spec.split(':')
    for a,l,t,r,b in sat_box(int(pg)):
        print(f'{n:14s} p{pg:>3}  area={a:5d}  [{l:.3f}, {t:.3f}, {r:.3f}, {b:.3f}]')
    print()
