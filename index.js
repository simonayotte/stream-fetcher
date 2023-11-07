import Streamlink from './streamlink.js'

console.log('Fetching stream...')

let link = 'https://www.twitch.tv/zackrawrr'
let stream = new Streamlink(link).output('./' + Date.now() + '.flv').start()

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