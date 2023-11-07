import { spawn, exec } from 'child_process';
import { EventEmitter } from 'events';
import fs from 'fs-extra';
import kill from 'tree-kill';

export default class Streamlink extends EventEmitter {
    constructor(stream) {
        super();
        this.stream = stream;
    }

    output = (loc) => {
        this.outputLoc = loc
        return this
    }

    quality = (qual) => {
        this.qual = qual
        return this
    }

    isLive(done) {
        exec(`streamlink -j ${this.stream}`, (err, stdout, stderr) => {
            const json = JSON.parse(stdout)
            this.qualities = !json.error ? Object.keys(json['streams']) : null
            done(!json.error)
        })
    }

    start = (done) => {
        if (this.outputLoc && fs.existsSync(this.outputLoc)) {
            this.emit('err', 'File already exists.')
            return this
        }
        this.isLive(live => {
            if (!live) {
                this.emit('err', 'Is not live.')
                return
            }
            const args = []
            if (this.outputLoc) {
                args.push('-o', this.outputLoc)
            }
            //TODO: Change default quality
            args.push(this.stream, this.qual || 'best')
            this.startTime = Math.floor(Date.now() / 1000)
            this.live = spawn('streamlink', args)
            this.live.stdout.on('data', (d) => {
                this.emit('log', d.toString())
            })

            this.live.on('close', (code, st) => this.end(code, st))
        })
        return this
    }

    live() {
        return this
    }

    end = (code, st) => {
        const endOutput = {
            exitCode: code,
            duration: Math.floor(Date.now() / 1000) - this.startTime,
            output: this.outputLoc,
            startTime: this.startTime,
            stream: this.stream
        }
        this.emit('end', endOutput)
        if (this.live) kill(this.live.pid)
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
