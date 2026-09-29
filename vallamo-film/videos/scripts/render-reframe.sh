#!/usr/bin/env bash
# "Meet Vallamo" reframed for 9:16 / 4:5 (films/meetframe/MeetReframe.tsx): the same pipeline as
# render-film.sh (240 fps master -> 4-subframe motion blur -> 60 fps BT.709), then the final
# 16:9 film's own audio mix copied on untouched, so sound is identical to the X film.
# Usage: scripts/render-reframe.sh <916|45> <version>
set -e
cd "$(dirname "$0")/.."
F=$(python3 -c "import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())")
fmt=$1; ver=$2; out=out/reframe/$ver; mkdir -p "$out/master"
BROWSER=()
[ -n "$REMOTION_BROWSER" ] && BROWSER=(--browser-executable="$REMOTION_BROWSER")
declare -A SIZE=([916]=1080x1920 [45]=1080x1350)
declare -A NAME=([916]=9x16 [45]=4x5)
npx remotion render src/index.ts "Reframe-$fmt" "$out/master/$fmt-240.mp4" --props "{\"fps\":240,\"format\":\"$fmt\"}" --codec h264 --crf 10 --pixel-format yuv444p --muted --concurrency ${CONCURRENCY:-6} --log error "${BROWSER[@]}"
"$F" -v error -y -i "$out/master/$fmt-240.mp4" -i ../deliverables/Vallamo-Meet-X-FINAL-v12.mp4 \
  -filter_threads 1 \
  -filter_complex "[0:v]tmix=frames=4:weights='1 1 1 1',select='not(mod(n+1\,4))',setpts=N/(60*TB),scale=in_range=tv:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:threads=1:flags=accurate_rnd+full_chroma_int,format=yuv420p[v]" \
  -map "[v]" -map 1:a -c:a copy -r 60 -c:v libx264 -preset slow -crf 17 -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +faststart -shortest \
  "$out/Ad1-MeetVallamo-${NAME[$fmt]}-${SIZE[$fmt]}-$ver.mp4"
rm -f "$out/master/$fmt-240.mp4"
echo "done $out/Ad1-MeetVallamo-${NAME[$fmt]}-${SIZE[$fmt]}-$ver.mp4"
