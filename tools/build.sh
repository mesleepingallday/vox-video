#!/usr/bin/env bash
# Full build: render the video in segments (in parallel), concat, mux the voiceover (grain optional).
#   tools/build.sh                 -> out/tencent.mp4
#   JOBS=3 SEG=60 tools/build.sh   -> segment length (s) and parallel renderers
#   tools/build.sh 4 7             -> re-render only segments 4..7, then concat + mux again
#   GRAIN=1 tools/build.sh         -> also burn in film grain (re-encodes the whole video; much larger file)
# Segments already rendered are kept in out/seg/ and skipped unless named on the command line.
set -euo pipefail
cd "$(dirname "$0")/.."
SEG=${SEG:-60}; JOBS=${JOBS:-3}
PRE=$(grep -o 'const PRE = [0-9.]*' app/index.html | grep -o '[0-9.]*$')
AUDIO=input/voice.mp3
ADUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$AUDIO")
TOTAL=$(python3 -c "print($ADUR + $PRE)")
N=$(python3 -c "import math; print(math.ceil($TOTAL / $SEG))")
mkdir -p out/seg
ONLY=""; [ $# -ge 2 ] && ONLY=$(seq "$1" "$2")
todo=()
for i in $(seq 0 $((N - 1))); do
  f=out/seg/s$(printf %03d $i).mp4
  if [ -n "$ONLY" ]; then echo "$ONLY" | grep -qx "$i" && todo+=("$i"); elif [ ! -s "$f" ]; then todo+=("$i"); fi
done
echo "total ${TOTAL}s, $N segments of ${SEG}s, rendering: ${todo[*]:-none}"
printf '%s\n' "${todo[@]}" | xargs -r -P "$JOBS" -I{} sh -c '
  i={}; a=$(python3 -c "print({} * '"$SEG"')"); b=$(python3 -c "print(min(({} + 1) * '"$SEG"', '"$TOTAL"'))")
  node tools/render.js seg "$a" "$b" out/seg/s$(printf %03d $i).mp4 > out/seg/s$(printf %03d $i).log 2>&1 && echo "segment $i done" || { echo "segment $i FAILED"; exit 1; }'
: > out/seg/list.txt
for i in $(seq 0 $((N - 1))); do echo "file 's$(printf %03d $i).mp4'" >> out/seg/list.txt; done
ffmpeg -v error -y -f concat -safe 0 -i out/seg/list.txt -c copy out/video_only.mp4
DELAY=$(python3 -c "print(int(round($PRE * 1000)))")
if [ "${GRAIN:-0}" = 1 ]; then
  ffmpeg -v error -y -i out/video_only.mp4 -i "$AUDIO" \
    -filter_complex "[0:v]noise=c0s=4:c0f=t+u,format=yuv420p[v];[1:a]adelay=${DELAY}:all=1,apad[a]" \
    -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k -shortest -movflags +faststart out/tencent.mp4
else  # video stream copied as rendered (CRF 17); only the audio is encoded
  ffmpeg -v error -y -i out/video_only.mp4 -i "$AUDIO" -filter_complex "[1:a]adelay=${DELAY}:all=1,apad[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/tencent.mp4
fi
echo "wrote out/tencent.mp4 ($(ffprobe -v error -show_entries format=duration -of csv=p=0 out/tencent.mp4) s)"
