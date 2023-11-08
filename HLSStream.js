import { Duplex } from 'stream'

class HLSStream extends Duplex {
    constructor(options) {
        super(options)
    }

    _write(chunk, encoding, callback) {
        callback()
    }

    _read(size) {

    }
}

const hlsStream = new HLSStream()

hlsStream.on('data', (chunk) => {
    // Implement logic when receiving data
})

export default hlsStream