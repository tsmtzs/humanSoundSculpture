// ////////////////////////////////////////////////////////////
//				Human Sound Sculpture
//
// Start the SuperCollider event stream, and send note events
// to web server.
// If started as a systemd service,
// run in bash
//		 journalctl -u hss-supercollider -f
// to see logs using journactl.
// ////////////////////////////////////////////////////////////
var hss, ip;

hss = "hssEvent.scd".loadRelative.at(0);

// Add a new Event type.
// Send messages to NetAddr.
Event.addEventType(\sendOsc, {
	// Uncomment the next code line when debugging.
	// [~freq.(), ~amp, ~dur].postln;
	//
	~address.sendMsg("/note", ~freq.(), ~amp, ~dur);
});

// NetAddr: the address of the web server.
// The loopback address is used, since
// the server runs on the same machine as SuperCollider.
hss.init(NetAddr("127.0.0.1", 57121));
// Set values
hss.ampMul = hss.amps.maxItem.reciprocal * 0.9;

// Uncomment the next code lines if there is no conductor
// among the performers.
// hss.play;
// hss.stop;
