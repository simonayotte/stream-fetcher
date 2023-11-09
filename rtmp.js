import NodeMediaServer from "node-media-server";

export default class RTMPServer {
    constructor() {
        const config = {
            rtmp: {
              port: 1935,
              chunk_size: 60000,
              gop_cache: true,
              ping: 30,
              ping_timeout: 60
            },
            http: {
              port: 8000,
              allow_origin: '*'
            },
            logType: 3
        }

        this.nms = new NodeMediaServer(config)
    }

    run() {
        this.nms.run()
    }
}
