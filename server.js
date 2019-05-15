const express = require('express');
const app = express();
const path = require('path');
const osc = require('osc');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080, clientTracking: true});

const oscMessageHandler = {
    '/action': (data, wss) => {
	wss.broadcast(data);
    },
    '/note': (data, wss) => {
	wss.sendToRandomClient(data);
    }
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views/index.html'));
});

app.get('/conductor', (req, res) => {
    res.sendFile(path.join(__dirname,'views/conductor.html'));
});

// error handling - from https://expressjs.com/en/guide/error-handling.html
app.use( (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops! Something went wrong.');
});

app.listen(3000, () => console.log('Server listening on port 3000'));

// Last client that played a note
wss.lastClient = null;

wss.broadcast = data => {
    wss.clients.forEach( client => {
	if (client.readyState === WebSocket.OPEN) {
	    client.send(data);
	};
    });
};

wss.sendToRandomClient = data => {
    let clients = Array.from(wss.clients);
    // select all clients that are different from lastClient
    clients = wss.clients.size < 2 ? clients : clients.filter(elem => elem !== wss.lastClient);

    let size = clients.length;
    console.log(`There are ${size} clients online`);
    let client = clients[ Math.floor(Math.random() * size) ];

    if (client && client.readyState === WebSocket.OPEN) {
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
	    Object.assign(msgObj, {args: msg.args.map(x => x.value)})

	    console.log('Recieved SC message:\n', msgObj);

	    oscMessageHandler[msgObj.type](JSON.stringify(msgObj), wss);
	});
    });
}, (udpPort) => {
    console.log('ERROR: udpPort');
})
    .catch(err => console.log('Something went wrong in udpPromise'));

// websockets: web server - web clients
wss.on('connection', ws => {
    // catch ws errors
    ws.onerror = err => {console.log("Something went wrong in a WebSocket")};

    ws.on('message', msg => {
	console.log('Client message: ', msg);

	udpPromise.then( udpPort => {
	    udpPort.send({address: '/action', args: {type: 's', value: msg}});

	})
	    .catch( console.log(console) );
    });
});
