import numpy as np, json, re, sys
path=np.load(sys.argv[1] if len(sys.argv)>1 else 'path.npy'); segs=json.load(open(sys.argv[2] if len(sys.argv)>2 else 'ref_segs.json'))
hopA=320; hopB=512; sr=16000
s=open('sil.txt').read()
st=np.array([float(x) for x in re.findall(r"silence_start: ([\d.]+)",s)]); en=np.array([float(x) for x in re.findall(r"silence_end: ([\d.]+)",s)]); st=st[:len(en)]
def t_of(sample):
    j=sample/hopB; i=np.searchsorted(path,j,side='left'); return i*hopA/sr
out=[]
for sg_ in segs:
    out.append(dict(sg_,t0=round(t_of(sg_['a']),2),t1=round(t_of(sg_['b']),2)))
# sentence starts
ss=[o for o in out if o['k']==0]
# distance of each sentence start to nearest pause end; and whether sentence start within a pause
def near(t): 
    d=np.abs(en-t); return d.min()
dd=np.array([near(o['t0']) for o in ss[1:]])
print('sentence starts within 0.15s of a pause end:',(dd<0.15).sum(),'/',len(dd),' within 0.3:',(dd<0.3).sum())
rng=np.random.default_rng(0); rr=np.array([near(t) for t in rng.uniform(0,586,2000)]); print('chance level within 0.15:',round((rr<0.15).mean()*len(dd),1),' within 0.3:',round((rr<0.3).mean()*len(dd),1))
# rate per phrase
r=np.array([o['syl']/max(o['t1']-o['t0'],0.05) for o in out]); print('phrase rate median',np.median(r).round(2),'IQR',np.percentile(r,[10,25,75,90]).round(2))
json.dump(out,open('aligned_phr.json','w'))
if '-v' in sys.argv:
    for o in out[:40]: print(o['t0'],o['t1'],o['kind'][0],o['syl'],round(o['syl']/max(o['t1']-o['t0'],0.05),1),o['text'][:70])
