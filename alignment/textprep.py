import re, json, os
raw=open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'input', 'script.md')).read()
raw=raw.replace('\\','')
ones="zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
tens="x x twenty thirty forty fifty sixty seventy eighty ninety".split()
def n2w(n):
    n=int(n)
    if n<20: return ones[n]
    if n<100: return tens[n//10]+('' if n%10==0 else ' '+ones[n%10])
    if n<1000: return ones[n//100]+' hundred'+('' if n%100==0 else ' '+n2w(n%100))
    if n<1000000: return n2w(n//1000)+' thousand'+('' if n%1000==0 else ' '+n2w(n%1000))
    return str(n)
def year(y):
    y=int(y)
    if 2000<=y<=2009: return 'two thousand'+('' if y==2000 else ' '+ones[y-2000])
    return n2w(y//100)+' '+(n2w(y%100) if y%100>=10 else 'oh '+ones[y%100])
def dec(m):
    a,b=m.group(1),m.group(2)
    return n2w(a)+' point '+' '.join(ones[int(c)] for c in b)
def spoken(t):
    t=t.replace('$400 Million','four hundred million dollar')
    t=t.replace('1260H','twelve sixty H').replace('175,000','one hundred seventy five thousand')
    t=t.replace('8 to 9 p.m.','eight to nine pee em').replace('2000s','two thousands')
    t=t.replace('U.S.','you ess')
    t=re.sub(r'\b(1[89]\d\d|20\d\d)\b',lambda m:year(m.group(1)),t)
    t=re.sub(r'(\d+)\.(\d+)',dec,t)
    t=re.sub(r'\d+',lambda m:n2w(m.group(0)),t)
    t=t.replace('%',' percent')
    for a,b in [('OICQ','oh eye see cue'),('ICQ','eye see cue'),('QQ','cue cue'),('AOL','ay oh el'),('CNN','see en en'),('CEO','see ee oh'),('CFIUS','siffius'),('FT','eff tee'),('PC','pee see')]:
        t=re.sub(r'\b'+a+r'\b',b,t)
    return t
def syl(word):
    w=re.sub(r"[^a-z]","",word.lower())
    if not w: return 0
    special={'the':1,'people':2,'business':2,'every':2,'riot':2,'being':2,'science':2,'area':3,'idea':3,'create':2,'created':3,'video':3,'media':3,'studio':3,'studios':3,'quiet':2,'chinese':2,'league':1,'tongue':1,'one':1,'once':1,'ubisoft':3,'tencent':2,'naspers':2,'beijing':2,'shenzhen':2,'weixin':2,'wechat':2,'fortnite':2,'valorant':3,'huateng':2,'guillemot':3,'employee':3,'something':2,'sometimes':2,'someone':2,'themselves':2,'games':1,'game':1,'named':1,'renamed':2,'based':1,'issue':2,'euros':2,'euro':2,'yuan':2,'value':2,'valued':2,'issue':2,'rescue':2,'argue':2,'continue':3,'fuel':2,'cruel':2,'really':2,'real':1,'idea':3,'reappeared':3,'financial':3,'social':2,'special':2,'official':3,'officials':3,'national':3,'operational':5,'million':2,'billion':2,'companies':3,'company':3,'opium':3,'spiritual':4,'actually':4,'usually':4,'influential':4,'period':3,'experience':4,'serious':3,'previous':3,'obvious':3,'various':3,'eight':1,'isn':1,"isnt":2,'wasnt':2,'doesnt':2,'didnt':2,'shouldnt':2,'couldnt':2,'werent':1,'arent':1,'owned':1,'called':1,'moved':1,'filed':1,'played':1,'signed':1,'blocked':1,'worked':1,'pushed':1,'changed':1,'helped':1,'released':2,'announced':2,'published':2,'removed':2,'revoked':2,'replaced':2,'resigned':2,'stepped':1,'dragged':1,'declined':2,'registered':3,'weighed':1,'noticed':2,'closed':1,'banned':1,'argued':2,'described':2,'reviewed':2,'cited':2,'reported':3,'invested':3,'counted':2,'noted':2,'diluted':3,'disclosed':2,'mentioned':2,'considered':3,'required':2,'preferred':2,'forced':1,'fired':1,'paid':1,'singled':2,'affiliated':5,'listed':2,'added':2,'started':2,'objected':3,'infringed':2,'wanted':2,'targeted':3,'voluntarily':5,'shareholder':3,'shareholders':3,'sometimes':2,'safeguards':2,'elsewhere':2,'lines':1,'rules':1,'stakes':1,'makes':1,'takes':1,'sales':1,'shares':1,'names':1,'times':1,'homes':1,'sides':1,'drives':1,'cultures':2,'pieces':2,'offices':3,'services':3,'changes':2,'pages':2,'prices':2,'bases':2,'addresses':3,'websites':2,'designations':4,'entities':3,'technologies':4,'industries':3,'studies':2,'countries':2,'parties':2,'agencies':3,'economies':4,'subsidiary':5,'fundamentally':5,'independence':4,'independent':4,'graduate':3,'immediately':5,'separate':3,'separately':4,'evidence':3,'audience':3,'audiences':4,'license':2,'science':2,'sweeney':2,'bleszinski':3,'capps':1,'polygon':3,'reuters':2,'mcentee':3,'monaco':3,'biden':2,'beeler':2,'laurel':2,'pentagon':3,'washington':3,'awakening':4,'clayton':2,'huge':1,'theyre':1,'were':1,'there':1,'where':1,'here':1,'are':1,'fire':2,'hour':2,'hours':2,'our':2,'quietly':3,'eye':1,'cue':1,'ay':1,'ee':1,'ess':1,'eff':1,'tee':1,'pee':1,'see':1,'oh':1,'el':1,'en':1,'em':1,'h':1}
    if w in special: return special[w]
    n=len(re.findall(r'[aeiouy]+',w))
    if w.endswith('e') and not w.endswith('le') and n>1: n-=1
    if w.endswith('es') and not re.search(r'(s|x|z|ch|sh|c|g)es$',w) and n>1: n-=1
    if w.endswith('ed') and not re.search(r'(t|d)ed$',w) and n>1: n-=1
    return max(1,n)
def nsyl(t): return sum(syl(w) for w in re.findall(r"[A-Za-z']+",spoken(t)))
# parse paragraphs -> sentences -> phrases
items=[]
for para in raw.split('\n'):
    para=para.strip()
    if not para: continue
    hm=re.match(r'^\*\*(.+)\*\*$',para)
    if hm:
        items.append(dict(kind='title',text=hm.group(1))); continue
    prot=para.replace('U.S.','U_S_').replace('p.m.','p_m_')
    prot=re.sub(r'(\d)\.(\d)',r'\1_DOT_\2',prot)
    parts=re.split(r'(?<=[.!?])\s+|(?<=[.!?]["”])\s+',prot)
    merged=[]
    for p in parts:
        p=p.strip().replace('U_S_','U.S.').replace('p_m_','p.m.').replace('_DOT_','.')
        if not p: continue
        if merged and re.search(r'(U\.S\.|p\.m\.)$',merged[-1]) and not p[0].isupper(): merged[-1]+=' '+p
        else: merged.append(p)
    for s in merged: items.append(dict(kind='sent',text=s))
for i,it in enumerate(items):
    it['id']=i; it['syl']=nsyl(it['text'])
    # phrases split at , ; : — and internal punctuation
    ph=[p.strip() for p in re.split(r'(?<=[,;:—])\s+|\s+—\s+',it['text']) if p.strip()]
    it['phr']=[(p,nsyl(p)) for p in ph]
json.dump(items,open('items.json','w'),indent=1)
print(len(items), sum(1 for i in items if i['kind']=='title'))
print('syl sents',sum(i['syl'] for i in items if i['kind']=='sent'),'syl titles',sum(i['syl'] for i in items if i['kind']=='title'))
print('words',sum(len(i['text'].split()) for i in items if i['kind']=='sent'))
for it in items[:14]: print(it['id'],it['kind'],it['syl'],it['text'][:90])
for it in items: 
    if re.search(r'U\.S\.|p\.m\.|\d\.\d',it['text']): print('CHK',it['id'],it['syl'],it['text'][:120],'=>',spoken(it['text'])[:140])
