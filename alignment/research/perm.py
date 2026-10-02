import random, time
import align3 as A
import numpy as np
t=time.time(); base=A.run(7.3); print('real order cost',round(base,1),'time',round(time.time()-t,1))
# shuffle sentences (keeping phrases grouped)
groups=[];cur=[]
for p in A.PH:
    if p['first'] and cur: groups.append(cur);cur=[]
    cur.append(p)
groups.append(cur)
res=[]
for seed in range(8):
    random.seed(seed); g=groups[:]; random.shuffle(g)
    PH=[p for gg in g for p in gg]
    A.PH=PH; A.n=len(PH); A.sy=np.array([p['syl'] for p in PH],float); A.cs=np.concatenate([[0],np.cumsum(A.sy)])
    A.endc=np.array([p['end'] for p in PH]); A.se=np.concatenate([[0],np.cumsum(A.endc==2)])
    res.append(round(A.run(7.3),1)); print(seed,res[-1],flush=True)
print('shuffled mean',np.mean(res),'sd',np.std(res))
