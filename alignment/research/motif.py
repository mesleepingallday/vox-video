import numpy as np, json, sys, re
C=np.load('mfcc.npy'); en=np.load('logen.npy'); T=len(C)
W=json.load(open('words3.json'))
def occ(pat): return np.array([w['t0'] for w in W if w['t0'] is not None and re.match(pat,w['w'])])
def slide(tpl):
    L=len(tpl)
    win=np.lib.stride_tricks.sliding_window_view(C,(L,12))[:,0]      # (T-L+1, L, 12)
    d=((win-tpl[None])**2).mean((1,2))
    return d
def minima(d,gap=25):
    order=np.argsort(d); taken=np.zeros(len(d),bool); out=[]
    for i in order[:20000]:
        if taken[max(0,i-gap):i+gap].any(): continue
        taken[i]=True; out.append(i)
        if len(out)>=400: break
    return np.array(out)
def evaluate(pat,L=30,nseed=14,tol=0.8,verbose=True):
    pt=occ(pat); N=len(pt)
    best=None
    seeds=np.linspace(0,N-1,nseed).astype(int)
    for s in seeds:
        c0=int(pt[s]*100)
        for off in range(-90,91,4):
            a=c0+off
            if a<0 or a+L>T: continue
            tpl=C[a:a+L]
            if en[a:a+L].min()<en.mean()-3.0: continue
            d=slide(tpl); mi=minima(d); K=int(N*1.2)
            det=np.sort(mi[:K])/100.0
            # hits: predicted occurrences with a detection within tol (after removing median offset)
            j=np.searchsorted(det,pt); j=np.clip(j,1,len(det)-1)
            near=np.where(np.abs(det[j]-pt)<np.abs(det[j-1]-pt),det[j],det[j-1])
            off_=near-pt; med=np.median(off_[np.abs(off_)<1.5]) if (np.abs(off_)<1.5).any() else 0
            hits=int((np.abs(off_-med)<tol).sum())
            if best is None or hits>best[0]: best=(hits,a,med,det,d[mi[:K]].max())
    hits,a,med,det,thr=best
    # null: same template, shifted predictions
    nulls=[]
    for sh in (-23,-17,-11,-7,7,11,17,23,31,41):
        p2=np.clip(pt+sh,0,T/100)
        j=np.searchsorted(det,p2); j=np.clip(j,1,len(det)-1)
        near=np.where(np.abs(det[j]-p2)<np.abs(det[j-1]-p2),det[j],det[j-1])
        nulls.append(int((np.abs(near-p2-med)<tol).sum()))
    if verbose: print(pat,'N',N,'best hits',hits,'template at',a/100,'offset',round(float(med),2),'null hits',nulls)
    return pt,det,med,a
if __name__=='__main__':
    for pat in sys.argv[1:]:
        evaluate(pat)
