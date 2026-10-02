import json,re,subprocess,os,numpy as np, scipy.io.wavfile as wf
exec(open('textprep.py').read().split("# parse paragraphs")[0])
items=json.load(open('items.json'))
def ftext(t):
    t=t.replace('$400 Million','four hundred million dollar').replace('1260H','twelve sixty H').replace('175,000','one hundred seventy five thousand')
    t=t.replace('8 to 9 p.m.','eight to nine P M').replace('2000s','two thousands').replace('U.S.','U S')
    t=re.sub(r'\b(1[89]\d\d|20\d\d)\b',lambda m:year(m.group(1)),t)
    t=re.sub(r'(\d+)\.(\d+)',dec,t); t=re.sub(r'\d+',lambda m:n2w(m.group(0)),t); t=t.replace('%',' percent')
    for a,b in [('OICQ','O I C Q'),('ICQ','I C Q'),('QQ','Q Q'),('AOL','A O L'),('CNN','C N N'),('CEO','C E O'),('CFIUS','siffius'),('FT','F T'),('PC','P C'),('Weixin','way shin'),('Huateng','hwah tung'),('WeChat','we chat')]:
        t=re.sub(r'\b'+a+r'\b',b,t)
    t=re.sub(r'[“”"—–]',' ',t)
    return t.strip()
segs=[];audio=[];pos=0;sr=16000
gap=np.zeros(int(0.06*sr),np.int16)
for it in items:
    for k,(p,sy) in enumerate(it['phr']):
        fn='ref/%03d_%d'%(it['id'],k)
        open(fn+'.txt','w').write(ftext(p)+'\n')
        if not os.path.exists(fn+'.wav'):
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','lavfi','-i','flite=textfile=%s.txt:voice=rms'%fn,'-ar','16000','-ac','1',fn+'.wav'],check=True)
        s,x=wf.read(fn+'.wav')
        # trim silence
        e=np.abs(x.astype(np.float32)); thr=e.max()*0.02
        nz=np.where(e>thr)[0]; x=x[max(0,nz[0]-160):min(len(x),nz[-1]+320)]
        segs.append(dict(item=it['id'],k=k,kind=it['kind'],text=p,syl=sy,a=pos,b=pos+len(x),last=(k==len(it['phr'])-1)))
        audio.append(x); pos+=len(x)
        g=gap if k<len(it['phr'])-1 else np.zeros(int(0.12*sr),np.int16)
        audio.append(g); pos+=len(g)
x=np.concatenate(audio); wf.write('ref.wav',sr,x)
json.dump(segs,open('ref_segs.json','w'))
print('phrases',len(segs),'ref dur',len(x)/sr)
