# word-level predicted times from align3 path (interpolating by syllables inside each matched group)
import json,re,sys
from align3 import *
rate=7.3
c,path=run(rate,True)
exec(open('textprep.py').read().split("# parse paragraphs")[0])
words=[]
for (i0,j0,i1,j1,k) in path:
    if k=='skipchunk': continue
    toks=[]
    for p in PH[i0:i1]:
        for t in p['text'].split():
            if not re.search(r'[A-Za-z0-9]',t): continue
            sy_=max(1,sum(syl(w) for w in re.findall(r"[A-Za-z']+",spoken(t))))
            toks.append([t,sy_,p['item']])
    if k=='skipsent':
        for t in toks: words.append(dict(w=t[0],item=t[2],t0=None))
        continue
    # speech time segments of chunks j0..j1
    segs=[(chunks[j][0],chunks[j][1]) for j in range(j0,j1)]
    tot=sum(b-a for a,b in segs); S=sum(t[1] for t in toks); acc=0
    def tm(frac):
        x=frac*tot
        for a,b in segs:
            if x<=b-a+1e-9: return a+x
            x-=b-a
        return segs[-1][1]
    for t in toks:
        words.append(dict(w=t[0],item=t[2],t0=round(tm(acc/S),3),t1=round(tm((acc+t[1])/S),3))); acc+=t[1]
json.dump(words,open('words3.json','w'))
print(len(words)); print([ (w['w'],w['t0']) for w in words[:12]])
