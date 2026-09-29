#!/usr/bin/env bash
# "You paid for the enquiry": 240 fps master -> 4-subframe motion blur -> 60 fps BT.709
# (same pipeline as render-film.sh), then the cut's music and SFX mix at -14 LUFS.
# Usage: scripts/render-paid.sh <main|short> <45|916> <version>
set -e
cd "$(dirname "$0")/.."
F=$(python3 -c "import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())")
cut=$1; fmt=$2; ver=$3; out=out/paid/$ver; mkdir -p "$out/master"
BROWSER=()
[ -n "$REMOTION_BROWSER" ] && BROWSER=(--browser-executable="$REMOTION_BROWSER")
declare -A SIZE=([916]=1080x1920 [45]=1080x1350)
declare -A NAME=([main]=35s [short]=15s)
npx remotion render src/index.ts "Paid-$cut-$fmt" "$out/master/$cut-$fmt-240.mp4" --props "{\"fps\":240,\"format\":\"$fmt\",\"cut\":\"$cut\"}" --codec h264 --crf 10 --pixel-format yuv444p --muted --concurrency ${CONCURRENCY:-6} --log error "${BROWSER[@]}"
"$F" -v error -y -i "$out/master/$cut-$fmt-240.mp4" \
  -filter_threads 1 \
  -vf "tmix=frames=4:weights='1 1 1 1',select='not(mod(n+1\,4))',setpts=N/(60*TB),noise=c0s=5:c0f=t+u:c1s=0:c2s=0,scale=in_range=tv:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:threads=1:flags=accurate_rnd+full_chroma_int,format=yuv420p" \
  -r 60 -c:v libx264 -preset slow -crf 17 -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +faststart -an \
  "$out/silent-$cut-$fmt.mp4"
[ -f "$out/mix-$cut.wav" ] || npx remotion render src/index.ts "Paid-$cut-mix" "$out/mix-$cut.wav" --codec=wav --log error "${BROWSER[@]}"
"$F" -v error -y -i "$out/silent-$cut-$fmt.mp4" -i "$out/mix-$cut.wav" -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 256k -shortest -movflags +faststart \
  "$out/Vallamo-PaidEnquiry-${NAME[$cut]}-${SIZE[$fmt]}-$ver.mp4"
echo "done $out/Vallamo-PaidEnquiry-${NAME[$cut]}-${SIZE[$fmt]}-$ver.mp4"
