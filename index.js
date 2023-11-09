import Streamlink from './streamlink.js'
import RTMPServer from './rtmp.js'

const rtmp = new RTMPServer()
rtmp.run()

const link = 'https://www.twitch.tv/ninja'
const stream = new Streamlink(link).start()

stream.getQualities()

stream.on('quality', (data) => {
    console.log(data)
})

stream.on('err', (err) => {
    console.log(err)
})

stream.on('end', (o) => {
    console.log("Stream ended")
    console.log(o)
})

stream.on('log', (data) => {
    console.log(data)
})