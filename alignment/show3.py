import sys,json
from align3 import *
rate=float(sys.argv[1]); lo=int(sys.argv[2]); hi=int(sys.argv[3])
c,path=run(rate,True)
rows=[]
for (i0,j0,i1,j1,k) in path:
    txt=' | '.join(p['text'] for p in PH[i0:i1])
    if k=='m':
        dur=ccs[j1]-ccs[j0]; S=cs[i1]-cs[i0]
        rows.append((round(chunks[j0][0],2),round(chunks[j1-1][1],2),j1-j0,int(S),round(S/dur,1),round(pa[j1-1],2),endc[i1-1],txt))
    else: rows.append((k,round(chunks[j0][0],2) if j0<m else None,txt[:80]))
import numpy as np
r=np.array([x[4] for x in rows if len(x)==8]); 
print('rate mean',r.mean().round(2),'sd',r.std().round(2),'n',len(r),'multi-chunk',sum(1 for x in rows if len(x)==8 and x[2]>1),'ends at sentence',sum(1 for x in rows if len(x)==8 and x[6]==2))
for x in rows[lo:hi]: print(x)
json.dump([list(map(lambda v: v.item() if hasattr(v,'item') else v,x)) for x in rows],open('al3_rows.json','w'))
