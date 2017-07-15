const express = require('express');
const app = express();
const path = require('path');
const osc = require('osc');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views/index.html'));
});

app.get('/conductor', (req, res) => {
    res.sendFile(path.join(__dirname,'views/conductor.html'));
});

app.listen(3000, () => console.log('Server listening on port 3000'));


//
const udpPromise = new Promise( (resolve, reject) => {
    const udpPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 57121,

    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

    udpPort.open();
    // udpPort.on('ready', () => {
    // 	udpPort.on('message', (msg) => {
    // 	    console.log(msg);
    // 	});
    // });

    udpPort.on('ready', resolve(udpPort));
    udpPort.on('error', reject(udpPort));
});


udpPromise.then( (udpPort) => {
    return new Promise( (resolve, reject) => {
	udpPort.on('message', (msg) => {
	    console.log('Recieved message:\n', msg, `\n\taddress:\t ${msg.address}\n`, `\targs:\t${msg.args[0].value}, ${msg.args[1].value}, ${msg.args[2].value}`);
	});
    });
}, (udpPort) => {
    console.log('ERROR: udpPort');
});


udpPromise.then( (udpPort) => {
    // OSC messages sent by web server to SC
    const oscMsgs = {
	start: { address: '/start' },
	end: { address: '/end' }
    };

    // Every second, send an OSC message to SuperCollider
    setInterval(function() {
	var msg = Math.random() > 0.5 ? oscMsgs.start : oscMsgs.end;

	console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
	udpPort.send(msg);
    }, 10000);

});
