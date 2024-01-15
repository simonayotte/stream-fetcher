import { spawn, exec } from 'child_process';
import { EventEmitter } from 'events';
import  kill  from 'tree-kill';

import hlsStream from './HLSStream.js'
import Ffmpeg from './Ffmpeg.js';

export default class Streamlink extends EventEmitter {
    constructor(stream) {
        super()
        this.stream = stream
    }

    quality = (qual) => {
        this.qual = qual
        return this
    }

    isLive = (done) => {
        exec(`streamlink -j ${this.stream}`, (err, stdout, stderr) => {

            if (err) {
                console.error(err)
                throw err
            }

            const json = JSON.parse(stdout)
            this.qualities = !json.error ? Object.keys(json['streams']) : null
            done(!json.error)
        })
    }

    start = (done) => {
        try {
            this.isLive(live => {
            
                if (!live) {
                    const error = new Error('Is not live.')
                    this.emit('err', error.message) 
                    throw error
                }
    
                const args = ['--stdout', this.stream, this.qual || '360p']
            
                this.startTime = Math.floor(Date.now() / 1000)
    
                this.live = spawn('streamlink', args)
                
                const ffmpeg = new Ffmpeg('rtmp://localhost:1935/live')
                ffmpeg.pipeStream(hlsStream)
               
                // Override the 'data' event of 'this.live.stdout' to handle the data
                this.live.stdout.on('data', (d) => {
                    // this.emit('log', d.toString())
                    // Sending data to the hlsStream 
                    hlsStream.push(d)
                })
    
                this.live.on('error', err => {
                    console.error(err)
                })
    
                this.live.on('close', (code) => this.end(code, done))
            })
        } catch (err) {
           console.error(err)
           done(err)
        }
        return this
    }

    live = () => {
        return this
    }

    end = (code, done) => {
        const endOutput = {
            exitCode: code,
            duration: Math.floor(Date.now() / 1000) - this.startTime,
            startTime: this.startTime,
            stream: this.stream
        }
        this.emit('end', endOutput)
        if (this.live) kill(this.live.pid)
        done(endOutput)
        return endOutput
    }

    getQualities = () => {
        this.isLive(live => {
            if (live) {
                this.emit('quality', this.qualities)
            } else {
                this.emit('err', 'Stream is not live.')
            }
        })
    }
}
