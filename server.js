// ////////////////////////////////////////////////////////////
//		Human Sound Sculpture
//
// This file sets the web server of the piece
// Run
//	journalctl -u hss-webServer -f
// in a terminal to see log messages.
// ////////////////////////////////////////////////////////////
const express = require('express');
const app = express();
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
// OSC communication with SuperCollider
const osc = require('node-osc');
const oscServer = new osc.Server(57121, '0.0.0.0');
const ip = process.env.HSS_IP || '192.168.100.2';
const sclang = new osc.Client(ip, 57120);
const oscPath = '/action';
// web sockets
// HSS_WSS implicitly loads the 'ws' module.
const HSS_WSS = require(__dirname + '/webServerJS/hss_wss.js').HSS_WSS;
const webServerPort = process.env.NODE_PORT || 3000;
const webSocketPort = process.env.WEBSOCKET_PORT || 8080;
const wss = new HSS_WSS({ port: webSocketPort, clientTracking: true });
// ////////////////////////////////////////////////////////////
// Event listeners:
// ////////////////////////////////////////////////////////////
// error handling - from https://expressjs.com/en/guide/error-handling.html
const appErrorListener = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops! Something went wrong.');
};
// OSC messages: SuperCollider => web server
const oscMsgListener = msgHandler => msg => {
    const msgObj = { type: msg[0] };

    Object.assign(msgObj,{ args: msg.slice(1) });

    msgHandler[msgObj.type](JSON.stringify(msgObj), wss);
    console.log('Recieved SC message:\n', msgObj);
};
// WebSocket error listener:
const wsErrorListener = error => console.log("Something went wrong in WebSockets", error);
// WebSocket message listener:
const wsMsgListener = (sclang, oscPath) => msg => {
    console.log('Client message: ', msg);

    if (msg === 'shutdown') {
	// On message 'shutdown' execute file 'killHSS.sh
	// OR USE sh /usr/bin/shutdown now
	exec(`sh ${__dirname}/bin/killHSS.sh`, (err, stdout, stderr) => {
	    if (err) {
		console.error(`exec error: ${err}`);
		return;
	    }

	    console.log('Script killHSS.sh ecexuted');
	});
	// return
	console.log('PC Shutdown');
    } else {
	sclang.send(oscPath, msg);
    }
};
// WebSocket listener on 'connection' event:
const wsConnectionListener = (errorListener, msgListener) => ws => {
    // catch ws errors
    ws.onerror = errorListener;

    ws.on('message', msgListener);
};
// ////////////////////////////////////////////////////////////
// Function 'oscMessageHandler' return an object;
// This is used to send data to clients
// for each receiving OSC message.
// ////////////////////////////////////////////////////////////
const oscMessageHandler = wss => {
    return {
	'/action': data => wss.broadcast(data),
	'/note': data => wss.sendToRandomClient(data)
    };
};

// Replace environment variables in public files
execSync(`/usr/bin/sed -i -e "s/HSS_IP/${ip}/g" -e "s/WEBSOCKET_PORT/${webSocketPort}/g" ${path.join(__dirname,"public/hss.js")}`);

app.use(express.static(path.join(__dirname, 'public')));

// Send to performers the basic web page of the piece:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views/index.html'));
});

// Send the 'conductor' web page:
app.get('/conductor', (req, res) => {
    res.sendFile(path.join(__dirname,'views/conductor.html'));
});

app.use(appErrorListener);

// OSC messages: SC => web clients
oscServer.on('message', oscMsgListener(oscMessageHandler(wss)));

// websockets: web server => web clients
wss.on('connection', wsConnectionListener(wsErrorListener, wsMsgListener(sclang, oscPath)));

// ////////////////////////////////////////////////////////////
app.listen(webServerPort, () => console.log('Server listening on port: ', webServerPort));
