import numpy as np, json, re, sys
from anchors2 import load
TOTAL=586.79
def build_chain(words_file,pair_files,dmax=0.42,tol_abs=1.0,tol_rel=0.22,verbose=True):
    W,toks,sylw=load(words_file); cs=np.concatenate([[0],np.cumsum(sylw)]); RATE=cs[-1]/TOTAL
    hyp=[]
    for pf in pair_files:
        for r in json.load(open(pf)):
            if r['d']>dmax or r['R']<0.3 or r['R']<0.5*r['exp'] or r['R']>2.2*r['exp']+0.3: continue
            w=(0.6-r['d'])*min(r['syl'],8)
            hyp.append((cs[r['i']],r['ta'],w,r['g'],r['i'])); hyp.append((cs[r['j']],r['tb'],w,r['g'],r['j']))
    # merge duplicates
    hyp.sort(); merged=[]
    for h in hyp:
        if merged and merged[-1][4]==h[4] and abs(merged[-1][1]-h[1])<0.2:
            m=merged[-1]; merged[-1]=(m[0],m[1],m[2]+h[2],m[3],m[4])
        else: merged.append(h)
    H=[(0.0,0.0,50.0,'START',0)]+merged+[(float(cs[-1]),TOTAL,50.0,'END',len(W))]
    H.sort(key=lambda h:(h[0],h[1])); n=len(H)
    best=np.full(n,-1e9); prev=np.full(n,-1,int); best[0]=H[0][2]
    for b in range(1,n):
        for a in range(b-1,-1,-1):
            if best[a]<-1e8: continue
            dx=H[b][0]-H[a][0]; dt=H[b][1]-H[a][1]
            if dx<=0 or dt<=0: continue
            ex=dx/RATE
            if abs(dt-ex)<=tol_rel*ex+tol_abs:
                v=best[a]+H[b][2]
                if v>best[b]: best[b]=v; prev[b]=a
    k=n-1; ch=[]
    while k>=0: ch.append(H[k]); k=prev[k]
    ch=ch[::-1]
    if verbose: print('hypotheses',len(merged),'chain length',len(ch),'chain ok' if ch[0][3]=='START' else 'CHAIN BROKEN')
    return W,sylw,cs,ch
def interpolate(W,sylw,cs,ch,outf):
    # speech-time domain interpolation
    s=open('sil.txt').read()
    st=np.array([float(x) for x in re.findall(r"silence_start: ([\d.]+)",s)]); en=np.array([float(x) for x in re.findall(r"silence_end: ([\d.]+)",s)]); st=st[:len(en)]
    grid=np.arange(0,TOTAL+0.01,0.01); sil=np.zeros(len(grid),bool)
    for a,b in zip(st,en): sil[int(a*100):int(b*100)]=True
    sp=np.cumsum(~sil)*0.01            # speech time at each grid time
    ax=np.array([c[0] for c in ch]); at=np.array([c[1] for c in ch]); asp=np.interp(at,grid,sp)
    def t_of(x):
        s_=np.interp(x,ax,asp); i=np.searchsorted(sp,s_,side='left'); return float(grid[min(i,len(grid)-1)])
    for i,w in enumerate(W):
        w['t0']=round(t_of(cs[i]),3); w['t1']=round(t_of(cs[i+1]),3)
    json.dump(W,open(outf,'w'))
if __name__=='__main__':
    W,sylw,cs,ch=build_chain(sys.argv[1],sys.argv[3:])
    for c in ch: print(round(c[0]),c[1],round(c[2],1),c[3], '| implied rate from prev')
    interpolate(W,sylw,cs,ch,sys.argv[2])
