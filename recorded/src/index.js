import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { spawn } from 'node:child_process'

createServer(async (request, response) => {
  const headers = {
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Methods': "*",
  }
  if(request.method === 'OPTIONS') {
    response.writeHead(204, headers)
    response.end()
    return;
  }

  response.writeHead(200, {
    'Content-Type': 'video/mp4'
  })

  const ffmpegProcess = spawn('ffmpeg', [
    '-i', 'pipe:0',
    '-f', 'mp4',
    '-vcodec', 'h264',
    '-acodec', 'aac',
    '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
    '-b:v', '1500k',
    '-maxrate', '1500k',
    '-bufsize', '1000k',
    '-f', 'mp4',
    '-vf', "monochrome,drawtext=text='xuxadasilva@gmail.com':x=10:y=H-th-10:fontsize=50:fontcolor=yellow:shadowcolor=black:shadowx=5:shadowy=5",
    'pipe:1'
  ], {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  createReadStream('./assets/video-ready.mp4').pipe(ffmpegProcess.stdin)

  ffmpegProcess.stderr.on('data', msg => console.log(msg.toString()))

  ffmpegProcess.stdout.pipe(response)
  
  request.once('close', () => {
    ffmpegProcess.stdout.destroy()
    ffmpegProcess.stdin.destroy()
    console.log('disconnected!', ffmpegProcess.kill())
  })

})
.listen(3000, () => console.log('server is running at 3000'))