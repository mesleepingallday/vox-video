# ASR with word timestamps for the voiceover, using sherpa-onnx + NeMo Parakeet TDT 0.6B v2 (int8).
# Model: https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2
# Usage (repo root): python3 alignment/transcribe.py [audio] [model_dir]   -> alignment/asr_words.json
import sys, json, subprocess, numpy as np, sherpa_onnx

AUDIO = sys.argv[1] if len(sys.argv) > 1 else 'input/voice.mp3'
MODEL = sys.argv[2] if len(sys.argv) > 2 else '/tmp/claude-0/models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8'
SR = 16000
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', AUDIO, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                     capture_output=True, check=True).stdout
x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
print('duration', len(x) / SR)

rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f'{MODEL}/encoder.int8.onnx', decoder=f'{MODEL}/decoder.int8.onnx', joiner=f'{MODEL}/joiner.int8.onnx',
    tokens=f'{MODEL}/tokens.txt', model_type='nemo_transducer', num_threads=4)

# cut points: quietest 20 ms frame within +-4 s of every 25 s mark
hop = SR // 50
en = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
cuts = [0]
while len(x) - cuts[-1] > 30 * SR:
    c = cuts[-1] + 25 * SR
    lo, hi = (c - 4 * SR) // hop, (c + 4 * SR) // hop
    cuts.append(int((lo + np.argmin(en[lo:hi])) * hop + hop // 2))
cuts.append(len(x))

words = []
for a, b in zip(cuts[:-1], cuts[1:]):
    s = rec.create_stream(); s.accept_waveform(SR, x[a:b]); rec.decode_stream(s)
    r = s.result; off = a / SR
    print(f'{off:7.2f} {r.text[:100]}')
    for tok, ts in zip(r.tokens, r.timestamps):
        t = round(off + ts, 3)
        if tok.startswith(' ') or tok.startswith('▁') or not words:
            words.append([tok.strip(' ▁'), t])
        else:
            words[-1][0] += tok
words = [w for w in words if w[0]]
json.dump(words, open('alignment/asr_words.json', 'w'))
print(len(words), 'words')
