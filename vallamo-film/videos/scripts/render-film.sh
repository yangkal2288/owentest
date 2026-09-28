#!/usr/bin/env bash
# Final: 240 fps master -> 4-subframe motion blur -> 60 fps, BT.709 limited range H.264.
# The master is limited range (BT.601, untagged): in_range=tv, or white lifts off 255.
# The scaler runs single-threaded (sliced scaling left 4 px seams every 216 rows) with
# accurate rounding (without it white landed at 234/127/127, a faint green tint).
# Usage: scripts/render-film.sh <CompositionPrefix> <out dir> <format> <version>
#   e.g. scripts/render-film.sh Meet meet x v2   (renders composition "Meet-x")
# Where Remotion can't download its own browser, set REMOTION_BROWSER to a local Chromium.
set -e
[ -d ~/.local/node/bin ] && export PATH=~/.local/node/bin:$PATH
cd "$(dirname "$0")/.."
F=$(python3 -c "import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())")
COMP=$1; DIR=$2; fmt=$3; ver=$4; out=out/$DIR/$ver; mkdir -p "$out/master"
BROWSER=()
[ -n "$REMOTION_BROWSER" ] && BROWSER=(--browser-executable="$REMOTION_BROWSER")
npx remotion render src/index.ts "$COMP-$fmt" "$out/master/$fmt-240.mp4" --props '{"fps":240}' --codec h264 --crf 10 --pixel-format yuv444p --muted --concurrency ${CONCURRENCY:-6} --log error "${BROWSER[@]}"
"$F" -v error -y -i "$out/master/$fmt-240.mp4" \
  -filter_threads 1 \
  -vf "tmix=frames=4:weights='1 1 1 1',select='not(mod(n+1\,4))',setpts=N/(60*TB),scale=in_range=tv:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:threads=1:flags=accurate_rnd+full_chroma_int,format=yuv420p" \
  -r 60 -c:v libx264 -preset slow -crf 17 -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +faststart -an \
  "$out/Vallamo-Meet-X-1920x1080-$ver.mp4"
echo "done $out/Vallamo-Meet-X-1920x1080-$ver.mp4"
