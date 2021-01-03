const Client = require('./client');
const readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});


var client = new Client("wss://hri7566.info:1222");
client.start();

client.ws.on('error', (err) => {
    console.error(err);
    client.start();
});

client.ws.on('message', data => {
    let msg = JSON.parse(data);
    if (msg.m === 'a') {
        console.log(msg.a);
    }
});

rl.on('line', str => {
    client.sendChat(str);
});
