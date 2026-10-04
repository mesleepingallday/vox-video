# Ingest supplied assets: assets/real/<ID>.* and assets/gen/<ID>.* -> printed PNGs in app/v3/photos + manifest.
#   python3 tools/ingest.py            (processes everything new or changed)
# Credits come from assets/real/CREDITS.txt lines: "ID | source URL | author | licence".
import os, json, subprocess, glob

# display height in the 1920x1080 frame, cut mode and halftone mode for each asset ID used by the film
SPEC = {
    'R01': (780, 'person', 'mono'), 'R08': (760, 'person', 'mono'), 'R09': (760, 'person', 'mono'),
    'R10a': (520, 'person', 'mono'), 'R10b': (520, 'person', 'mono'), 'R14': (700, 'person', 'mono'),
    'R17a': (700, 'person', 'mono'), 'R17b': (700, 'person', 'mono'), 'R18': (700, 'person', 'mono'), 'R21': (600, 'person', 'mono'),
    'R04': (800, 'white', 'duo'), 'R07': (640, 'white', 'duo'), 'R11': (640, 'white', 'duo'), 'R12': (640, 'white', 'duo'), 'R13': (640, 'white', 'duo'),
    'R19a': (700, 'white', 'duo'), 'R19b': (700, 'white', 'duo'), 'R19c': (700, 'white', 'duo'), 'R19d': (700, 'white', 'duo'), 'R20': (640, 'white', 'duo'),
    'R06': (520, 'none', 'mono'),
    'G02': (540, 'white', 'mono'), 'G03': (700, 'white', 'mono'), 'G04': (600, 'white', 'mono'), 'G05': (420, 'white', 'duo'), 'G06': (640, 'white', 'duo'),
    'G07': (360, 'white', 'mono'), 'G08a': (700, 'white', 'mono'), 'G08b': (700, 'white', 'mono'), 'G09': (620, 'white', 'mono'), 'G10': (520, 'white', 'mono'),
    'G11': (820, 'none', 'duo'), 'G12': (420, 'white', 'mono'), 'G13': (820, 'none', 'mono'), 'G14': (820, 'none', 'duo'), 'G15': (820, 'none', 'duo'),
    'G16': (700, 'white', 'mono'), 'G17': (700, 'none', 'duo'), 'G18': (360, 'white', 'mono'),
}
os.makedirs('app/v3/photos', exist_ok=True)
credits = {}
if os.path.exists('assets/real/CREDITS.txt'):
    for line in open('assets/real/CREDITS.txt', encoding='utf8'):
        p = [x.strip() for x in line.split('|')]
        if len(p) >= 4 and p[0]: credits[p[0]] = f'{p[2]} / {p[3]}'
man = {}
for src in sorted(glob.glob('assets/real/*') + glob.glob('assets/gen/*')):
    ID = os.path.splitext(os.path.basename(src))[0]
    if ID not in SPEC: continue
    h, cut, mode = SPEC[ID]; out = f'app/v3/photos/{ID}.png'
    if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(src):
        subprocess.run(['python3', 'tools/print.py', src, out, '--h', str(h), '--cut', cut, '--mode', mode], check=True)
    man[ID] = {'src': f'{ID}.png', 'credit': credits.get(ID, '' if ID.startswith('G') else 'CREDIT MISSING')}
open('app/v3/photos/manifest.js', 'w').write('window.PHOTO3 = ' + json.dumps(man, indent=1) + ';\n')
print('manifest:', ', '.join(man) or '(empty)')
