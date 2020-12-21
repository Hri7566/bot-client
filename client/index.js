const WebSocket = require('ws');

module.exports = class Client {
    constructor (uri) {
        this.ws;
        this.uri = uri;
        this.part = {};
        this.reconnectTimeout = 5;
    }

    start() {
        this.ws = new WebSocket(this.uri);
        this.ws.setMaxListeners(0);
        this.ws.on('open', () => {
            console.log("Connected");
        });
        this.ws.on('close', () => {
            console.log("Disconnected. Attempting to reconnect in "+this.reconnectTimeout+" seconds...");
            this.reconnect();
        });
        this.ws.on('error', err => {
            if (err) {
                console.error(err);
                console.log("Error connecting to client. Attempting to reconnect in "+this.reconnectTimeout+" seconds...");
                this.reconnect();
            }
        });
    }

    reconnect() {
        setTimeout(() => {
            this.ws.removeAllListeners();
            this.start();
        }, this.reconnectTimeout*1000);
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
