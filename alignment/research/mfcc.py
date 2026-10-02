import numpy as np, scipy.io.wavfile as wf, scipy.signal as sg, scipy.fftpack as fp
sr,x=wf.read('voice16k.wav'); x=x.astype(np.float32)/32768
x=np.append(x[0],x[1:]-0.97*x[:-1])
f,t,Z=sg.stft(x,sr,nperseg=400,noverlap=240,window='hamming',padded=False,boundary=None)
P=np.abs(Z)**2
def mel(f): return 2595*np.log10(1+f/700)
def imel(m): return 700*(10**(m/2595)-1)
nf=26; pts=imel(np.linspace(mel(100),mel(7000),nf+2)); FB=np.zeros((nf,len(f)))
for i in range(nf):
    l,c,r=pts[i],pts[i+1],pts[i+2]
    FB[i]=np.clip(np.minimum((f-l)/(c-l),(r-f)/(r-c)),0,None)
M=np.log(FB@P+1e-8)
C=fp.dct(M,axis=0,norm='ortho')[1:13].T      # T x 12
C=(C-C.mean(0))/C.std(0)
en=M.mean(0)
np.save('mfcc.npy',C.astype(np.float32)); np.save('logen.npy',en.astype(np.float32)); print(C.shape)
