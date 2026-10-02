import numpy as np, json, re, sys, itertools, collections
C=np.load('mfcc.npy'); en=np.load('logen.npy'); T=len(C); enmed=np.median(en)
exec(open('textprep.py').read().split("# parse paragraphs")[0])
def load(words_file):
    W=json.load(open(words_file))
    norm=lambda w: re.sub(r"[^a-z0-9$%]","",w.lower())
    toks=[norm(w['w']) for w in W]
    sylw=[max(1,sum(syl(x) for x in re.findall(r"[A-Za-z']+",spoken(w['w'])))) for w in W]
    return W,toks,sylw
def pairs_for(W,toks,sylw,minsyl,maxocc_pairs=6):
    idx=collections.defaultdict(list)
    for i,t in enumerate(toks): idx[t].append(i)
    seen=set(); out=[]
    for t,lst in idx.items():
        if len(lst)<2: continue
        cand=[]
        for a_,i in enumerate(lst):
            others=lst[a_+1:]
            if len(others)>maxocc_pairs: others=others[:maxocc_pairs]
            for j in others: cand.append((i,j))
        for i,j in cand:
            a,b=i,j
            while a>0 and toks[a-1]==toks[b-1] and W[a-1]['item']==W[i]['item'] and W[b-1]['item']==W[j]['item'] and b-1>i: a-=1;b-=1
            n=1
            while a+n<b and b+n<len(toks) and toks[a+n]==toks[b+n] and W[a+n]['item']==W[a]['item'] and W[b+n]['item']==W[b]['item']: n+=1
            key=(a,b,n)
            if key in seen: continue
            seen.add(key)
            sy=sum(sylw[a:a+n])
            if sy<minsyl: continue
            out.append((a,b,n,sy))
    return out
def match(W,i,j,n,M,Lmax=80):
    ti=W[i]['t0']; tj=W[j]['t0']; di=W[i+n-1]['t1']-ti; dj=W[j+n-1]['t1']-tj
    L=int(np.clip(round(100*min(di,dj)*0.9),24,Lmax))
    a0=max(0,int(ti*100)-M); a1=min(T,int(ti*100)+L+M); b0=max(0,int(tj*100)-M); b1=min(T,int(tj*100)+L+M)
    if b0-a0<L+20: return None
    if a1>b0: # overlapping windows: shrink to avoid self-match
        mid=(int(ti*100)+int(tj*100))//2; a1=min(a1,mid+L//2); b0=max(b0,mid+L//2+1)
    A=C[a0:a1]; B=C[b0:b1]; na,nb=len(A),len(B)
    if na<L+5 or nb<L+5: return None
    D=((A**2).sum(1)[:,None]+(B**2).sum(1)[None,:]-2*A@B.T)/12
    cum=np.zeros((na+1,nb+1),np.float32)
    for r in range(1,na+1): cum[r,1:]=cum[r-1,:-1]+D[r-1]
    ds=(cum[L:,L:]-cum[:-L,:-L])/L
    ea=np.convolve((en[a0:a1]>enmed-1.5).astype(float),np.ones(L)/L,'valid'); eb=np.convolve((en[b0:b1]>enmed-1.5).astype(float),np.ones(L)/L,'valid')
    mask=(ea[:,None]>0.8)&(eb[None,:]>0.8)
    if mask.sum()<200: return None
    ds2=np.where(mask,ds,9.0); k=np.argmin(ds2); ia,ib=np.unravel_index(k,ds2.shape); best=float(ds2[ia,ib])
    bg=ds[mask]; z=(best-np.median(bg))/(bg.std()+1e-6)
    # extend along the diagonal to find full common region
    kmin=-min(ia,ib); kmax=min(na-ia,nb-ib)
    diag=np.array([D[ia+k,ib+k] for k in range(kmin,kmax)]); sm=np.convolve(diag,np.ones(9)/9,'same')
    c=-kmin+L//2; lo=c; hi=c
    while lo>0 and sm[lo-1]<0.75: lo-=1
    while hi<len(sm)-1 and sm[hi+1]<0.75: hi+=1
    r0=lo+kmin; r1=hi+kmin
    return dict(ta=(a0+ia+r0)/100,tb=(b0+ib+r0)/100,R=(r1-r0)/100,exp=(di+dj)/2,d=best,z=float(z),i=i,j=j,n=n)
if __name__=='__main__':
    wf_=sys.argv[1]; M=int(float(sys.argv[2])*100); minsyl=int(sys.argv[3]); outf=sys.argv[4]
    W,toks,sylw=load(wf_)
    P=pairs_for(W,toks,sylw,minsyl)
    print('pairs to test',len(P),flush=True)
    res=[]
    for (a,b,n,sy) in P:
        if W[a]['t0'] is None or W[b]['t0'] is None: continue
        m=match(W,a,b,n,M)
        if m: m['g']=' '.join(toks[a:a+n]); m['syl']=sy; res.append(m)
    json.dump(res,open(outf,'w'))
    good=[r for r in res if r['d']<0.5]
    print('matched',len(res),'good(d<0.5)',len(good))
    for r in sorted(good,key=lambda r:r['d'])[:50]: print(round(r['d'],2),round(r['z'],1),r['g'],'| t',r['ta'],r['tb'],'| R',r['R'],'exp',round(r['exp'],2),'| off',round(r['ta']-W[r['i']]['t0'],2),round(r['tb']-W[r['j']]['t0'],2))
