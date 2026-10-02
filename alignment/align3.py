import re, json, numpy as np, sys
exec(open('textprep.py').read().split("# parse paragraphs")[0])
items=json.load(open('items.json'))
s=open('sil.txt').read()
st=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",s)]
en=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",s)]
TOTAL=586.7945
nuc=np.load('nuclei.npy')
# build chunks, merging blips (<0.16s or <=1 nuclei & <0.25s) into pauses
bounds=[0.0]+[x for p in zip(st,en) for x in p]+[TOTAL]
raw=[(bounds[2*i],bounds[2*i+1]) for i in range(len(bounds)//2)]
chunks=[]
for a,b in raw:
    k=int(((nuc>=a)&(nuc<b)).sum())
    if b-a<0.16 or (b-a<0.25 and k<=1): continue
    chunks.append([a,b,k])
m=len(chunks)
cd=np.array([c[1]-c[0] for c in chunks]); pa=np.array([chunks[i+1][0]-chunks[i][1] for i in range(m-1)]+[0.5])
print('chunks',m,'speech',cd.sum().round(1))
# phrases
PH=[]
for it in items:
    ph=it['phr']
    for k,(p,sy) in enumerate(ph):
        PH.append(dict(item=it['id'],kind=it['kind'],text=p,syl=max(sy,1),end=2 if k==len(ph)-1 else 1,first=(k==0),nph=len(ph)))
n=len(PH); sy=np.array([p['syl'] for p in PH],float); cs=np.concatenate([[0],np.cumsum(sy)])
endc=np.array([p['end'] for p in PH]); se=np.concatenate([[0],np.cumsum(endc==2)])
ccs=np.concatenate([[0],np.cumsum(cd)])
def run(rate,ret=False):
    INF=1e15
    D=np.full((n+1,m+1),INF); B={}
    D[0,0]=0
    for i in range(n+1):
        for j in range(m+1):
            d=D[i,j]
            if d>=INF: continue
            # skip chunk
            if j<m:
                c=d+3+4*cd[j]
                if c<D[i,j+1]: D[i,j+1]=c;B[(i,j+1)]=(i,j,'skipchunk')
            # skip sentence (only at sentence start)
            if i<n and PH[i]['first']:
                k=i+PH[i]['nph']; c=d+8+0.5*(cs[k]-cs[i])
                if c<D[k,j]: D[k,j]=c;B[(k,j)]=(i,j,'skipsent')
            if i<n and j<m:
                for c_ in (1,2,3):
                    if j+c_>m: break
                    dur=ccs[j+c_]-ccs[j]
                    for p in range(1,10):
                        if i+p>n: break
                        S=cs[i+p]-cs[i]; ex=S/rate
                        if ex>dur*1.6+0.6: break
                        if ex<dur*0.55-0.4: continue
                        cost=((dur-ex)**2)/((0.12+0.08*ex)**2)
                        cost+=3.0*(c_-1)                      # pauses at non-punct
                        cost+=1.0*(se[i+p-1]-se[i])           # sentence end w/o pause
                        e=endc[i+p-1]; pz=pa[j+c_-1]
                        cost+= (-3.0*min(pz,0.5) if e==2 else 0.6-1.0*min(pz,0.3))
                        v=d+cost
                        if v<D[i+p,j+c_]: D[i+p,j+c_]=v;B[(i+p,j+c_)]=(i,j,'m')
    if not ret: return D[n,m]
    path=[];cur=(n,m)
    while cur!=(0,0):
        i0,j0,k=B[cur]; path.append((i0,j0,cur[0],cur[1],k)); cur=(i0,j0)
    return D[n,m],path[::-1]
if __name__=='__main__':
    for rate in (5.0,5.5,6.0,6.3,6.6,6.9,7.2,7.5,7.8):
        c,path=run(rate,True)
        ss=sum(1 for p in path if p[4]=='skipsent'); sc=sum(1 for p in path if p[4]=='skipchunk')
        skl=sum(cs[p[2]]-cs[p[0]] for p in path if p[4]=='skipsent'); skd=sum(ccs[p[3]]-ccs[p[1]] for p in path if p[4]=='skipchunk')
        print(rate,'cost',round(c,1),'skipped sents',ss,'(syl',int(skl),') skipped chunks',sc,'(sec',round(skd,1),')')
    json.dump(dict(chunks=chunks,PH=PH),open('al3_in.json','w'))
