#!/bin/zsh
# Final: 240 fps master -> 4-subframe motion blur -> 60 fps, BT.709 limited range H.264.
# Usage: scripts/render-film.sh <CompositionPrefix> <out dir> <feed|story|landscape> <version>
set -e
export PATH=~/.local/node/bin:$PATH
cd "$(dirname $0)/.."
F=$(python3 -c "import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())")
COMP=$1; DIR=$2; fmt=$3; ver=$4; out=out/$DIR/$ver; mkdir -p $out/master
npx remotion render src/index.ts $COMP-$fmt $out/master/$fmt-240.mp4 --props '{"fps":240}' --codec h264 --crf 10 --pixel-format yuv444p --muted --concurrency 8 --log error
$F -v error -y -i $out/master/$fmt-240.mp4 \
  -vf "tmix=frames=4:weights='1 1 1 1',select='not(mod(n+1\,4))',setpts=N/(60*TB),scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p" \
  -r 60 -c:v libx264 -preset slow -crf 17 -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -movflags +faststart -an \
  $out/Vallamo-Launch-$fmt-$ver.mp4
echo done $out/Vallamo-Launch-$fmt-$ver.mp4
