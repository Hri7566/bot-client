const WebSocket = require('ws');

module.exports = class Client {
    constructor (uri) {
        this.ws;
        this.uri = uri;
        this.part = {};
    }

    start() {
        this.ws = new WebSocket(this.uri);
	this.ws.setMaxListeners(0);
    }

    sendChat(str) {
        this.sendObj({
            m:'a',
            a:str,
            p: this.getPart()
        });
    }

    sendObj(obj) {
        if (typeof(obj) !== 'object') return;
        let j = JSON.stringify(obj);
        this.send(j);
    }

    send(j) {
        this.ws.send(j);
    }

    getPart() {
        this.sendObj({
            m:'get'
        });
        let ret;
        this.ws.on('message', data => {
            let msg = JSON.parse(data);
            if (msg.m == "get") {
                ret = msg.p;
            }
        });
        return ret;
    }
}
