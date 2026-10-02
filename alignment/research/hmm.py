import re, json, numpy as np, scipy.io.wavfile as wf, scipy.signal as sg, sys, os
exec(open('textprep.py').read().split("# parse paragraphs")[0])
items=json.load(open('items.json'))
# ---------- acoustic features
sr,x=wf.read('voice32k.wav'); x=x.astype(np.float32)/32768
f,tt,Z=sg.stft(x,sr,nperseg=800,noverlap=800-320,window='hann',padded=False,boundary=None)
P=np.abs(Z)**2
def band(lo,hi): return 10*np.log10(P[(f>=lo)&(f<hi)].sum(0)+1e-10)
E=band(80,12000); LF=band(80,3000); HF=band(4500,12000)
E=E-np.percentile(E,95); R=HF-LF
T=len(E); print('frames',T,'dur',T*0.01)
s_sil=np.clip((-33-E)/8,-3,1.5)
s_vow=np.clip((E+22)/8,-3,1)+np.clip((-5-R)/10,-2,0.5)
s_sib=np.clip((R+2)/6,-3,1.5)+np.clip((E+40)/10,-2,0)
s_oth=np.where((R>8)&(E>-30),-1.2,-0.15)+np.clip((E+45)/10,-1.5,0)
EM=np.stack([s_sil,s_vow,s_sib,s_oth],1).astype(np.float32)   # T x 4
SIL,VOW,SIB,OTH=0,1,2,3
def units(word):
    w=re.sub(r"[^a-z]","",word.lower()); u=[]; i=0; n=len(w)
    V='aeiouy'
    while i<n:
        c=w[i]; nx=w[i+1] if i+1<n else ''
        if w.startswith(('tio','sio','cia','tia','cio','ciou','tiou'),i) and i>0: u.append(SIB); i+=2; continue
        if w.startswith('tch',i): u.append(SIB); i+=3; continue
        if w.startswith(('sh','ch'),i): u.append(SIB); i+=2; continue
        if w.startswith(('th','ph','gh','ck','ng','wh','qu'),i): u.append(OTH); i+=2; continue
        if c in 'sz': 
            u.append(SIB); i+=1
            while i<n and w[i] in 'sz': i+=1
            continue
        if c=='j': u.append(SIB); i+=1; continue
        if c=='x': u.append(OTH); u.append(SIB); i+=1; continue
        if c=='c': u.append(SIB if nx in 'eiy' and nx else OTH); i+=1; continue
        if c in V and not (c=='y' and i==0):
            j=i
            while j<n and w[j] in V: j+=1
            if j==n and w[i:j]=='e' and any(k==VOW for k in u) and not w.endswith('le'): i=j; continue
            u.append(VOW); i=j; continue
        u.append(OTH); i+=1
        while i<n and w[i]==c: i+=1
    if not u: u=[VOW]
    return u
def build(use_titles):
    cls=[];skip=[];word_first=[];words=[];enter=[]
    for it in items:
        if it['kind']=='title' and not use_titles: continue
        toks=[t for t in it['text'].split() if re.search(r'[A-Za-z0-9]',t)]
        for k,t in enumerate(toks):
            sp=[w for w in re.findall(r"[A-Za-z']+",spoken(t))]
            us=[]
            for w in sp: us+=units(w)
            word_first.append(len(cls))
            for q,uu in enumerate(us):
                cls.append(uu); skip.append(-2.5 if uu==OTH else -1e9); enter.append(0.0)
            pc=0
            if re.search(r'[,;:]["”]?$',t): pc=1
            if k==len(toks)-1: pc=2
            words.append(dict(w=t,item=it['id'],pc=pc))
            # optional silence after word
            cls.append(SIL)
            skip.append([0.0,-0.3,-2.0][pc])       # cost of skipping this silence
            enter.append([-3.0,0.0,0.8][pc])        # cost/bonus of entering it
    return np.array(cls),np.array(skip,np.float32),np.array(enter,np.float32),word_first,words
def viterbi(cls,skip,enter,tag):
    N=len(cls); NEG=-1e9
    V=np.full(N,NEG,np.float32); V[0]=EM[0,cls[0]]
    bp=np.lib.format.open_memmap('bp_%s.npy'%tag,mode='w+',dtype=np.uint8,shape=(T,N))
    skipprev=np.concatenate([[NEG],skip[:-1]])   # skip cost of state s-1 when jumping s-2 -> s
    for t in range(1,T):
        stay=V
        mv=np.empty(N,np.float32); mv[0]=NEG; mv[1:]=V[:-1]; mv+=enter
        sk=np.empty(N,np.float32); sk[:2]=NEG; sk[2:]=V[:-2]; sk+=skipprev+enter
        best=np.maximum(np.maximum(stay,mv),sk)
        b=np.where(best==stay,0,np.where(best==mv,1,2)).astype(np.uint8)
        bp[t]=b
        V=best+EM[t][cls]
    # end in last or second last state
    s=N-1 if V[N-1]>=V[N-2] else N-2
    score=float(V[s]); path=np.zeros(T,np.int32)
    for t in range(T-1,-1,-1):
        path[t]=s
        s-=int(bp[t,s]) if t>0 else 0
    del bp; os.remove('bp_%s.npy'%tag)
    return score,path
if __name__=='__main__':
    for ut in (True,False):
        cls,skip,enter,wf_,words=build(ut)
        print('states',len(cls),'words',len(words))
        score,path=viterbi(cls,skip,enter,'T' if ut else 'N')
        print('TITLES' if ut else 'NO TITLES','score',round(score,1),'per frame',round(score/T,4))
        first=np.full(len(cls),-1,np.int32)
        # first frame of each state
        idx=np.arange(T)
        st,fi=np.unique(path,return_index=True)
        first[st]=fi
        # word start: first visited state in word
        wfa=wf_+[len(cls)]
        for wi,w in enumerate(words):
            fr=[first[s] for s in range(wfa[wi],wfa[wi+1]) if first[s]>=0]
            w['t0']=round(min(fr)*0.01,2) if fr else None
            silstate=wfa[wi+1]-1
            w['sil']=round(float((path==silstate).sum())*0.01,2)
        json.dump(words,open('words_%s.json'%('T' if ut else 'N'),'w'))
        np.save('path_%s.npy'%('T' if ut else 'N'),path)
