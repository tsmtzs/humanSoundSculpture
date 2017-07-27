const express = require('express');
const app = express();
const path = require('path');
const osc = require('osc');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080, clientTracking: true});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views/index.html'));
});

app.get('/conductor', (req, res) => {
    res.sendFile(path.join(__dirname,'views/conductor.html'));
});

app.listen(3000, () => console.log('Server listening on port 3000'));

wss.lastClient = null;

wss.sendToRandomClient = data => {
    var clients = Array.from(wss.clients);
    clients = wss.clients.size > 2 ? clients : clients.filter( elem => elem !== wss.lastClient );
    console.log('Clients: ', clients);
    var size = clients.length;
    var client = clients[ Math.floor(Math.random() * size) ];

    if (client.readyState === WebSocket.OPEN) {
	client.send(data);
	wss.lastClient = client;
    };
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
	    const msgObj = {type: msg.address};
	    if (msg.args) {
		Object.assign(msgObj, {args: msg.args.map(x => x.value)})

		console.log('Recieved SC message:\n', msgObj);
	    };

	    wss.sendToRandomClient(JSON.stringify(msgObj));
	});
    });
}, (udpPort) => {
    console.log('ERROR: udpPort');
});

// websockets: web server - web clients
wss.on('connection', ws => {
    ws.on('message', msg => {
	console.log('Client message: ', msg);

	udpPromise.then( udpPort => {
	    udpPort.send({address: '/action', args: {type: 's', value: msg}});

	})
	    .catch( console.log(console) );
    });
});
