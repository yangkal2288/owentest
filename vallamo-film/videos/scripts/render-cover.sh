#!/usr/bin/env bash
# "Meet Vallamo" 9:16 / 4:5 with the cover built in (films/meetframe/MeetCover.tsx): the cover
# held as the first frame, then the reframed film. Same pipeline as render-reframe.sh; the final
# film's mix is laid on 0.5 s later so it stays in sync after the cover.
# Usage: scripts/render-cover.sh <916|45|11|x> <version>   (x: the original 16:9 film)
set -e
cd "$(dirname "$0")/.."
F=$(python3 -c "import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())")
fmt=$1; ver=$2; out=out/cover/$ver; mkdir -p "$out/master"
BROWSER=()
[ -n "$REMOTION_BROWSER" ] && BROWSER=(--browser-executable="$REMOTION_BROWSER")
declare -A SIZE=([916]=1080x1920 [45]=1080x1350 [x]=1920x1080 [11]=1080x1080)
declare -A NAME=([916]=9x16 [45]=4x5 [x]=16x9 [11]=1x1)
npx remotion render src/index.ts "Cover-$fmt" "$out/master/$fmt-240.mp4" --props "{\"fps\":240,\"format\":\"$fmt\"}" --codec h264 --crf 10 --pixel-format yuv444p --muted --concurrency ${CONCURRENCY:-6} --log error "${BROWSER[@]}"
"$F" -v error -y -i "$out/master/$fmt-240.mp4" -i ../deliverables/Vallamo-Meet-X-FINAL-v12.mp4 \
  -filter_threads 1 \
  -filter_complex "[0:v]tmix=frames=4:weights='1 1 1 1',select='not(mod(n+1\,4))',setpts=N/(60*TB),scale=in_range=tv:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:threads=1:flags=accurate_rnd+full_chroma_int,format=yuv420p[v];[1:a]adelay=500:all=1[a]" \
  -map "[v]" -map "[a]" -c:a aac -b:a 256k -ar 48000 -r 60 -c:v libx264 -preset slow -crf 17 -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +faststart -shortest \
  "$out/Ad1-MeetVallamo-${NAME[$fmt]}-${SIZE[$fmt]}-$ver.mp4"
rm -f "$out/master/$fmt-240.mp4"
echo "done $out/Ad1-MeetVallamo-${NAME[$fmt]}-${SIZE[$fmt]}-$ver.mp4"
