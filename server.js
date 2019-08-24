const express = require('express');
const app = express();
const path = require('path');
// OSC communication with SuperCollider
const osc = require('node-osc');
const oscServer = new osc.Server(57121, '0.0.0.0');
const sclang = new osc.Client('localhost', 57120); // CAUTION: static ip address
const oscPath = '/action';
// web sockets
const WebSocket = require('ws');
const webServerPort = 3000;

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

app.listen(webServerPort, () => console.log('Server listening on port: ', webServerPort));

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

    const candidateClients = clients.filter(wsClient => wsClient !== wss.lastClient);
    const size = candidateClients.length;
    const client = candidateClients[Math.floor(Math.random() * size)];

    if (client && client.readyState === WebSocket.OPEN) {
	console.log(`There are ${size + 1} clients online.\n Selected client is:\n ${client}`);
	client.send(data);
	wss.lastClient = client;
    };
};


// OSC: SC => web server
oscServer.on('message', (msg) => {
	const msgObj = {type: msg[0]};

	Object.assign(msgObj,{args: msg.slice(1)});

	oscMessageHandler[msgObj.type](JSON.stringify(msgObj), wss);
	console.log('Recieved SC message:\n', msgObj);
});

// websockets: web server => web clients
wss.on('connection', ws => {
    // catch ws errors
    ws.onerror = err => {console.log("Something went wrong in a WebSocket")};

    ws.on('message', msg => {
	console.log('Client message: ', msg);

	sclang.send(oscPath, msg);
    });
});
