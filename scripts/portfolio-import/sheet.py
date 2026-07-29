import json, sys, os
from PIL import Image, ImageDraw
projs = json.load(open('manifest.json'))
sel = sys.argv[2:] if len(sys.argv)>2 else None
items=[]
for p in projs:
    if sel and p['slug'] not in sel: continue
    for im in (p['images'] if sel else p['images'][:1]):
        items.append((p['slug'] if not sel else im['file'], im['file']))
cols,W=6,300; H=int(W*2/3)
rows=(len(items)+cols-1)//cols
sh=Image.new('RGB',(cols*W,rows*(H+16)),'white'); d=ImageDraw.Draw(sh)
for i,(lab,f) in enumerate(items):
    im=Image.open(f'img/{f}').convert('RGB')
    im.thumbnail((W,H),Image.LANCZOS)
    x,y=(i%cols)*W,(i//cols)*(H+16)
    sh.paste(im,(x+(W-im.width)//2,y+(H-im.height)//2))
    d.rectangle([x,y,x+W-1,y+H-1],outline='#ccc')
    d.text((x+3,y+H+3),lab[:44],fill='black')
sh.save(sys.argv[1],quality=85)
print(len(items),'tiles')
