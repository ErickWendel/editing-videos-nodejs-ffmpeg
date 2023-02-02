import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { createReadStream } from 'node:fs'
const PORT = 3000

// curl -i -X OPTIONS -N localhost:3000
// curl -N localhost:3000
createServer(async (request, response) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers)
    response.end()
    return
  }
  response.writeHead(200, {
    'Content-Type': 'video/mp4'
  })

  const run = spawn('ffmpeg',
    [
      '-i', 'pipe:0',
      // '-i', './assets/video.mp4',
      '-f', 'mp4',    
      // '-ss', '5',
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
      stdio: ['pipe','pipe','pipe']
    })
  
  createReadStream('./assets/video3.mp4').pipe(run.stdin)

  // run.stderr.on('data', (msg) => console.log('msg', msg.toString()))
  run.stdout.pipe(response)

  request.once('close', () => {
    run.stdin.destroy();
    run.stdout.destroy();
    run.stderr.destroy();

    console.log('disconneced!', run.kill('SIGKILL'))
  })
  
})
  .listen(PORT)
  .on('listening', _ => console.log(`server is running at ${PORT}`))
