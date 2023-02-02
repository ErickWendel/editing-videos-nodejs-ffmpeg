ffmpeg \
  -i ./video.mp4 \
  -vcodec h264 \
  -acodec aac \
  -movflags frag_keyframe+empty_moov+default_base_moof \
  -b:v 1500k \
  -maxrate 1500k \
  -bufsize 1000k \
  -f mp4 \
  video-ready.mp4