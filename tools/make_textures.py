# Generates paper textures into app/tex/. Run from the repo root: python3 tools/make_textures.py
import numpy as np, os
from PIL import Image, ImageFilter, ImageDraw
os.makedirs('app/tex', exist_ok=True)
def grainmap(w,h,seed,fib=1.0):
    r=np.random.default_rng(seed)
    fine=np.asarray(Image.fromarray(np.clip(128+r.normal(0,1,(h,w))*46,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)),np.float32)/128-1
    mid=np.asarray(Image.fromarray(np.clip(128+r.normal(0,1,(h//6,w//6))*50,0,255).astype(np.uint8)).resize((w,h),Image.BICUBIC),np.float32)/128-1
    big=np.asarray(Image.fromarray(np.clip(128+r.normal(0,1,(h//60+2,w//60+2))*50,0,255).astype(np.uint8)).resize((w,h),Image.BICUBIC).filter(ImageFilter.GaussianBlur(20)),np.float32)/128-1
    g=fine*0.055+mid*0.03+big*0.04
    im=Image.new('L',(w,h),128); d=ImageDraw.Draw(im)
    for _ in range(int(w*h/2600*fib)):
        x,y=r.integers(0,w),r.integers(0,h); L=r.integers(5,30); a=r.uniform(0,np.pi); c=int(r.choice([96,104,150,158]))
        d.line([(x,y),(x+L*np.cos(a),y+L*np.sin(a))],fill=c,width=1)
    f=np.asarray(im.filter(ImageFilter.GaussianBlur(0.5)),np.float32)/128-1
    return g+f*0.22
def hexrgb(h): return np.array([int(h[i:i+2],16) for i in (1,3,5)],np.float32)
def tex(name,col,w,h,seed,dark=False,grid=None,vig=0.0,q=90):
    g=grainmap(w,h,seed); c=hexrgb(col)[None,None,:]
    if dark: out=c+(255-c)*np.clip(g*1.3+0.02,0,1)[:,:,None]*0.55+c*np.minimum(g,0)[:,:,None]*0.8
    else: out=c*(1+g[:,:,None]*0.9)
    if grid:
        gm=np.zeros((h,w),np.float32); gm[::grid,:]=1; gm[:,::grid]=1; gm[::grid*5,:]=2; gm[:,::grid*5]=2
        gm=np.asarray(Image.fromarray((gm*60).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)),np.float32)/120
        out=out*(1-gm[:,:,None]*0.16)+np.array([60,110,170],np.float32)[None,None,:]*gm[:,:,None]*0.16
    if vig>0:
        yy,xx=np.mgrid[0:h,0:w]; rr=np.sqrt(((xx-w/2)/(w/2))**2+((yy-h/2)/(h/2))**2)
        out=out*(1-vig*np.clip(rr-0.55,0,1)**1.6)[:,:,None]
    Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save('app/tex/%s.jpg'%name,quality=q)
BW,BH=2112,1188
tex('bg_cream','#EDE4CF',BW,BH,1,vig=0.22); tex('bg_grid','#F1EAD9',BW,BH,2,grid=44,vig=0.18)
tex('bg_navy','#17223F',BW,BH,3,dark=True,vig=0.35); tex('bg_ink','#1B1916',BW,BH,4,dark=True,vig=0.3)
tex('bg_red','#D93E27',BW,BH,5,vig=0.3); tex('bg_kraft','#C4A070',BW,BH,6,vig=0.25)
tex('bg_blue','#2450C0',BW,BH,7,vig=0.3); tex('bg_yellow','#FFCF2B',BW,BH,8,vig=0.2)
for i,(n,c,d) in enumerate([('white','#FAF6EA',0),('cream','#EDE4CF',0),('yellow','#FFCF2B',0),('red','#E2432A',0),('blue','#2553C7',0),('ink','#1B1916',1),('kraft','#C7A374',0),('teal','#1A8A70',0),('pink','#F0B8A4',0),('navy','#17223F',1),('grey','#CDC6B5',0),('green','#3DAA5C',0)]):
    tex('p_'+n,c,1024,1024,20+i,dark=bool(d),q=88)
