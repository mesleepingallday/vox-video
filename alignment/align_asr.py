# Align script words (alignment/items.json) to ASR word timestamps (alignment/asr_words.json)
# and write app/timing.js in the shape the engine expects:
#   TM[id] = {t0, t1, kind, text, words: [[word, t0], ...]}
# Usage (repo root): python3 alignment/align_asr.py
import json, re, os
HERE = os.path.dirname(os.path.abspath(__file__))
__file__ = os.path.join(HERE, 'textprep.py')
exec(open(__file__).read().split('# parse paragraphs')[0])  # spoken()

items = json.load(open(os.path.join(HERE, 'items.json')))
asr = json.load(open(os.path.join(HERE, 'asr_words.json')))
TOTAL = 586.8

def units(tok):  # normalized spoken sub-words of one token
    return [u for u in re.sub(r"[^a-z' ]", ' ', spoken(tok.replace('$', '')).lower().replace('-', ' ')).replace("'", '').split() if u]

# script side: (unit, item id, token index)
A = []; toks = []
for it in items:
    tk = it['text'].split()
    toks.append(tk)
    for k, t in enumerate(tk):
        for u in units(t): A.append((u, it['id'], k))
# asr side: (unit, word index)
B = []
for j, (w, t) in enumerate(asr):
    for u in units(w): B.append((u, j))
print('script units', len(A), 'asr units', len(B))

def cost(a, b):
    if a == b: return 0.0
    if len(a) > 3 and len(b) > 3 and a[:4] == b[:4]: return 0.4
    if a[:2] == b[:2]: return 0.8
    return 1.3
GAP = 0.75
n, m = len(A), len(B)
# banded Needleman-Wunsch (band follows the diagonal scaled by n/m)
BAND = 400
INF = 1e18
D = [None] * (n + 1); P = [None] * (n + 1)
D[0] = {j: j * GAP for j in range(0, min(m, BAND) + 1)}; P[0] = {j: 2 for j in D[0]}
for i in range(1, n + 1):
    c = int(i * m / n); lo, hi = max(0, c - BAND), min(m, c + BAND)
    d, p, prev = {}, {}, D[i - 1]
    for j in range(lo, hi + 1):
        best, bp = prev.get(j, INF) + GAP, 1  # skip script unit
        if j > 0:
            v = prev.get(j - 1, INF) + cost(A[i - 1][0], B[j - 1][0])
            if v < best: best, bp = v, 0
            v = d.get(j - 1, INF) + GAP  # skip asr unit
            if v < best: best, bp = v, 2
        d[j] = best; p[j] = bp
    D[i], P[i] = d, p
i, j = n, m; pairs = []
while i > 0 or j > 0:
    bp = P[i].get(j, 1 if i > 0 else 2)
    if bp == 0: pairs.append((i - 1, j - 1)); i -= 1; j -= 1
    elif bp == 1: i -= 1
    else: j -= 1
pairs.reverse()

# token start = time of the asr word matched by the token's first matched unit (exact or near match)
tt = {}
exact = 0
for a, b in pairs:
    if cost(A[a][0], B[b][0]) <= 0.4:
        exact += cost(A[a][0], B[b][0]) == 0
        key = (A[a][1], A[a][2])
        if key not in tt: tt[key] = asr[B[b][1]][1]
print('matched units', len(pairs), 'exact', exact, 'of', n)

# list of all tokens in order, interpolate gaps
seq = [(it['id'], k) for it in items for k in range(len(toks[it['id']]))]
times = [tt.get(s) for s in seq]
miss = [seq[q] for q, v in enumerate(times) if v is None]
known = [q for q, v in enumerate(times) if v is not None]
for q in range(len(seq)):
    if times[q] is None:
        l = max([k for k in known if k < q], default=None); r = min([k for k in known if k > q], default=None)
        if l is None: times[q] = times[r]
        elif r is None: times[q] = times[l] + 0.25 * (q - l)
        else: times[q] = times[l] + (times[r] - times[l]) * (q - l) / (r - l)
# enforce monotonic
for q in range(1, len(times)): times[q] = max(times[q], times[q - 1])
print('unmatched tokens', len(miss))

# word end estimate: next ASR word start after the last token (bounded by duration ~ chars)
asr_t = [t for _, t in asr]
def end_of(t_last, word, t_next):
    est = t_last + 0.06 * len(re.sub(r'\W', '', word)) + 0.12
    nxt = [x for x in asr_t if x > t_last + 1e-3]
    if nxt: est = min(est, nxt[0] + 0.25)
    return round(min(est, t_next if t_next is not None else TOTAL), 3)

TM = {}; q = 0; last = None
for it in items:
    tk = toks[it['id']]
    ws = [[w, round(times[q + k], 3)] for k, w in enumerate(tk)]
    q += len(tk)
    TM[str(it['id'])] = dict(t0=ws[0][1], t1=None, kind=it['kind'], text=it['text'], words=ws)
ids = [str(it['id']) for it in items]
for k, i in enumerate(ids):
    nxt = TM[ids[k + 1]]['t0'] if k + 1 < len(ids) else None
    w = TM[i]['words'][-1]
    TM[i]['t1'] = end_of(w[1], w[0], nxt)
open(os.path.join(HERE, '..', 'app', 'timing.js'), 'w').write('const TM=' + json.dumps(TM) + ';\n')
json.dump(dict(unmatched=[f'{a}:{toks[a][b]}' for a, b in miss]), open(os.path.join(HERE, 'align_report.json'), 'w'), indent=0)
for i in ids: print(f"{i:>4} {TM[i]['t0']:7.2f} {TM[i]['t1']:7.2f}  {TM[i]['text'][:70]}")
