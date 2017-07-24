const express = require('express');
const app = express();
const path = require('path');
const osc = require('osc');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views/index.html'));
});

app.get('/conductor', (req, res) => {
    res.sendFile(path.join(__dirname,'views/conductor.html'));
});

app.listen(3000, () => console.log('Server listening on port 3000'));

wss.broadcast = data => {
    console.log('Inside wss.broadcast');

    wss.clients.forEach( client => {
	if (client.readyState === WebSocket.OPEN) {
	    console.log('\tInside wss.broadcast. Sending data to clients');
	    client.send(data)
	};
    });
};

// OSC: web server - SC
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
    udpPort.on('ready', resolve(udpPort));
    udpPort.on('error', reject(udpPort));
});


udpPromise.then( (udpPort) => {
    return new Promise( (resolve, reject) => {
	udpPort.on('message', (msg) => {
	    try {
		console.log('Recieved SC message:\n', msg, `\n\taddress:\t ${msg.address}\n`, `\targs:\t${msg.args[0].value}, ${msg.args[1].value}, ${msg.args[2].value}`);
	    }
	    catch (err) {
		console.log(err);
	    };

	    const msgObj = {type: msg.address};
	    if (msg.args) {
		Object.assign(msgObj, {args: msg.args.map(x => x.value)})
	    };

	    wss.broadcast( JSON.stringify(msgObj) );
	});
    });
}, (udpPort) => {
    console.log('ERROR: udpPort');
});

// websockets: web server - web clients
wss.on('connection', ws => {
    ws.on('message', msg => {
	console.log('Client message: ', msg);

	udpPromise.then( (udpPort) => {
	    // OSC messages sent by web server to SC
	    const oscMsgs = {
		start: { address: '/start' },
		stop: { address: '/stop' }
	    };

	    udpPort.send(oscMsgs[msg]);

	    // Every second, send an OSC message to SuperCollider
	    // setInterval(function() {
	    // 	var msg = Math.random() > 0.5 ? oscMsgs.start : oscMsgs.end;

	    // 	console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
	    // 	udpPort.send(msg);
	    // }, 10000);

	})
	    .catch( console.log(console) );
    });
});
