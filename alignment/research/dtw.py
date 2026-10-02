import numpy as np, scipy.io.wavfile as wf, scipy.signal as sg, scipy.fftpack as fp, json, sys, time
def feats(path,hop,nper=512):
    sr,x=wf.read(path); x=x.astype(np.float32)/32768
    x=np.append(x[0],x[1:]-0.97*x[:-1])
    f,t,Z=sg.stft(x,sr,nperseg=nper,noverlap=nper-hop if hop<nper else 0,window='hamming',padded=False,boundary=None) if hop<nper else sg.stft(x,sr,nperseg=nper,noverlap=0,window='hamming',padded=False,boundary=None)
    P=np.abs(Z)**2
    mel=lambda f:2595*np.log10(1+f/700); imel=lambda m:700*(10**(m/2595)-1)
    nf=26; pts=imel(np.linspace(mel(100),mel(7000),nf+2)); FB=np.zeros((nf,len(f)))
    for i in range(nf):
        l,c,r=pts[i],pts[i+1],pts[i+2]; FB[i]=np.clip(np.minimum((f-l)/(c-l),(r-f)/(r-c)),0,None)
    M=np.log(FB@P+1e-7)
    C=fp.dct(M,axis=0,norm='ortho')[0:13].T
    C=(C-C.mean(0))/C.std(0)
    C[:,0]*=1.5
    return C.astype(np.float32), len(x)/sr
def dtw(A,B,Wb,pen0=0.15,pen3=0.1):
    # A real (N), B ref (M); each step advances A by 1, B by 0..3
    N,M=len(A),len(B); K=2*Wb+1; INF=np.float32(1e9)
    Bp=np.concatenate([np.zeros((Wb+4,B.shape[1]),np.float32),B,np.zeros((N+Wb+4,B.shape[1]),np.float32)])
    valid=np.concatenate([np.zeros(Wb+4,bool),np.ones(M,bool),np.zeros(N+Wb+4,bool)])
    bp=np.zeros((N,K),np.uint8)
    D=np.full(K,INF,np.float32)
    slope=M/N
    def row(i):
        c=int(round(i*slope))                # center ref index for row i
        j0=c-Wb                               # ref index of k=0
        seg=Bp[j0+Wb+4:j0+Wb+4+K]; v=valid[j0+Wb+4:j0+Wb+4+K]
        d=((seg-A[i])**2).mean(1); d[~v]=INF
        return d,c
    d,c_prev=row(0); D=np.full(K,INF,np.float32); D[Wb]=d[Wb]   # start at ref 0
    for i in range(1,N):
        d,c=row(i); sh=c-c_prev               # band shift
        # predecessor with ref step s: k' = k + sh - s
        best=np.full(K,INF,np.float32); arg=np.zeros(K,np.uint8)
        for s,pen in ((1,0.0),(2,0.0),(0,pen0),(3,pen3)):
            off=sh-s
            cand=np.full(K,INF,np.float32)
            if off>=0:
                if off<K: cand[:K-off]=D[off:]
            else:
                cand[-off:]=D[:K+off]
            cand=cand+pen
            m=cand<best; best[m]=cand[m]; arg[m]=s
        D=best+d; bp[i]=arg; c_prev=c
    # backtrack from ref end
    kend=(M-1)-(int(round((N-1)*slope))-Wb)
    k=kend; total=float(D[k]); path=np.zeros(N,np.int32); c=int(round((N-1)*slope))
    for i in range(N-1,-1,-1):
        c=int(round(i*slope)); j=c-Wb+k; path[i]=j
        if i>0:
            s=int(bp[i,k]); cprev=int(round((i-1)*slope)); k=(j-s)-(cprev-Wb)
    return total/N,path
if __name__=='__main__':
    HOP=320
    A,durA=feats('voice16k.wav',HOP)
    sr,x=wf.read(sys.argv[1] if len(sys.argv)>1 else 'ref.wav'); durB=len(x)/sr
    hopB=int(round(HOP*durB/durA))
    B,_=feats(sys.argv[1] if len(sys.argv)>1 else 'ref.wav',hopB)
    print('A',A.shape,'B',B.shape,'hopB',hopB)
    t=time.time(); cost,path=dtw(A,B,Wb=2000); print('cost',round(cost,4),'time',round(time.time()-t,1))
    np.save(sys.argv[2] if len(sys.argv)>2 else 'path.npy',path); json.dump(dict(hopA=HOP,hopB=hopB),open('dtw_meta.json','w'))
