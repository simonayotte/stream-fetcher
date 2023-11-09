import { spawn } from 'child_process'

export default class Ffmpeg {
    constructor(rtmpUrl) {
        this.rtmpUrl = rtmpUrl
        
        const args = [
            '-i', '-',
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-ar', '44100',
            '-ab', '128k',
            '-ac', '2',
            '-strict', '-2',
            '-flags', '+global_header',
            '-bsf:a', 'aac_adtstoasc',
            '-bufsize', '3000k',
            '-f', 'flv',
            this.rtmpUrl,
        ]
      
        this.ffmpeg = spawn('ffmpeg', args)

        this.ffmpeg.stderr.on('data', (err) => {
            console.error(`stderr: ${err}`)
        })

        this.ffmpeg.stdout.on('data', (d) => {
            console.log(d)
        })
    }

    // Method to pipe data hlsStream -> ffmpeg process
    pipeStream = (hlsStream) => {
        hlsStream.pipe(this.ffmpeg.stdin)
    }
}