import re, json, numpy as np, sys
sys.path.insert(0,'.')
import importlib.util
src=open('textprep.py').read().split("# parse paragraphs")[0]
exec(src)
items=json.load(open('items.json'))
s=open('sil.txt').read()
st=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",s)]
en=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",s)]
TOTAL=586.7945
pauses=list(zip(st,en))
bounds=[0.0]+[x for p in pauses for x in p]
chunks=[(bounds[2*i],bounds[2*i+1]) for i in range(len(pauses))]
if TOTAL-pauses[-1][1]>0.15: chunks.append((pauses[-1][1],TOTAL)); pauses.append((TOTAL,TOTAL+0.5))
cd=np.array([b-a for a,b in chunks]); pdur=np.array([b-a for a,b in pauses]); m=len(chunks)
def build(use_titles):
    W=[]
    for it in items:
        if it['kind']=='title' and not use_titles: continue
        toks=it['text'].split()
        toks=[t for t in toks if re.search(r'[A-Za-z0-9]',t)]
        for k,t in enumerate(toks):
            sy=sum(syl(w) for w in re.findall(r"[A-Za-z']+",spoken(t)))
            cls=0
            if re.search(r'[,;:]["”]?$',t): cls=1
            if k==len(toks)-1: cls=2
            W.append(dict(w=t,syl=max(sy,1),cls=cls,item=it['id'],k=k))
        # dash handling: words before an em dash
    return W
def run(use_titles):
    W=build(use_titles); n=len(W)
    sy=np.array([w['syl'] for w in W],float); cs=np.concatenate([[0],np.cumsum(sy)])
    cls=np.array([w['cls'] for w in W])
    sent_end=np.concatenate([[0],np.cumsum(cls==2)])
    rate=sy.sum()/cd.sum()
    INF=1e15; MAXW=60
    D=np.full((m+1,n+1),INF); B=np.zeros((m+1,n+1),int); D[0,0]=0
    for j in range(1,m+1):
        dur=cd[j-1]; p=pdur[j-1]
        prev=D[j-1]
        # expected position band
        for b in range(1,n+1):
            a0=max(0,b-MAXW)
            pa=prev[a0:b]
            if pa.min()>=INF: continue
            exp=(cs[b]-cs[a0:b])/rate
            c=pa+((dur-exp)**2)/((0.10+0.07*exp)**2)
            # internal sentence ends penalty
            c=c+1.5*(sent_end[b-1]-sent_end[a0:b])
            k=int(np.argmin(c)); v=c[k]
            cl=cls[b-1]
            if cl==0: v+=5.0
            elif cl==1: v+=1.0-2.0*min(p,0.3)
            else: v+=-4.0*min(p,0.5)
            D[j,b]=v; B[j,b]=a0+k
    b=n; segs=[]
    for j in range(m,0,-1):
        a=B[j,b]; segs.append((a,b)); b=a
    segs=segs[::-1]
    return D[m,n],rate,W,segs
if __name__=='__main__':
    for ut in (True,False):
        cost,rate,W,segs=run(ut)
        rr=[];rows=[]
        for j,(a,b) in enumerate(segs):
            S=sum(w['syl'] for w in W[a:b]); r=S/cd[j]; rr.append(r)
            rows.append((j,round(chunks[j][0],2),round(cd[j],2),S,round(r,2),round(pdur[j],2),W[b-1]['cls'],' '.join(w['w'] for w in W[a:b])))
        rr=np.array(rr)
        print('TITLES' if ut else 'NO TITLES','cost',round(cost,1),'rate',round(rate,2),'chunk-rate mean',round(rr.mean(),2),'sd',round(rr.std(),2),'ends: none',sum(1 for r in rows if r[6]==0),'comma',sum(1 for r in rows if r[6]==1),'sent',sum(1 for r in rows if r[6]==2))
        json.dump(dict(rows=rows,segs=[(int(a),int(b)) for a,b in segs],W=W,chunks=chunks,pauses=pauses),open('al2_%s.json'%('T' if ut else 'N'),'w'))
        if ut:
            for r in rows[:12]: print(r)
