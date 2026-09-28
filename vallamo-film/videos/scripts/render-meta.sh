#!/usr/bin/env bash
# The Meta ad: 240 fps master -> 4-subframe motion blur -> 60 fps BT.709 (same pipeline as render-film.sh),
# then the music and SFX mix muxed on at -14 LUFS.
# Usage: scripts/render-meta.sh <916|45> <version>
set -e
cd "$(dirname "$0")/.."
F=$(python3 -c "import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())")
fmt=$1; ver=$2; out=out/meta/$ver; mkdir -p "$out/master"
BROWSER=()
[ -n "$REMOTION_BROWSER" ] && BROWSER=(--browser-executable="$REMOTION_BROWSER")
declare -A SIZE=([916]=1080x1920 [45]=1080x1350)
npx remotion render src/index.ts "Meta-$fmt" "$out/master/$fmt-240.mp4" --props '{"fps":240}' --codec h264 --crf 10 --pixel-format yuv444p --muted --concurrency ${CONCURRENCY:-6} --log error "${BROWSER[@]}"
"$F" -v error -y -i "$out/master/$fmt-240.mp4" \
  -filter_threads 1 \
  -vf "tmix=frames=4:weights='1 1 1 1',select='not(mod(n+1\,4))',setpts=N/(60*TB),scale=in_range=tv:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:threads=1:flags=accurate_rnd+full_chroma_int,format=yuv420p" \
  -r 60 -c:v libx264 -preset slow -crf 17 -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +faststart -an \
  "$out/silent-$fmt.mp4"
[ -f "$out/mix.wav" ] || npx remotion render src/index.ts Meta-mix "$out/mix.wav" --codec=wav --log error "${BROWSER[@]}"
"$F" -v error -y -i "$out/silent-$fmt.mp4" -i "$out/mix.wav" -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 256k -shortest -movflags +faststart \
  "$out/Vallamo-Meta-${SIZE[$fmt]}-$ver.mp4"
echo "done $out/Vallamo-Meta-${SIZE[$fmt]}-$ver.mp4"
