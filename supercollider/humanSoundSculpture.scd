// ////////////////////////////////////////////////////////////
//				Human Sound Sculpture
//
// Start the SuperCollider event stream, and send notes
// to the web server.
// ////////////////////////////////////////////////////////////
var hss, ip;

hss = "hssEvent.scd".loadRelative.at(0);

// Add a new Event type.
// Send messages to NetAddr.
Event.addEventType(\sendOsc, {
	// Uncomment the next code line when debugging.
	// Run in bash
	//		 journalctl -u hss-supercollider -f
	// to see logs using journactl.
	[~freq.(), ~amp, ~dur].postln;
	// 
	~address.sendMsg("/note", ~freq.(), ~amp, ~dur);
});

// Read the IP from an environment variable.
// Set it to an Interpreter variable or as a
// value to an appropriate current environment's key.
// For some reason assignment to variables doesn't work in daemon mode (-D flag)
// with the usual 'var ip = "192.168.100.2".getenv'.
// ip = "HSS _IP".getenv;
ip = 192.168.100.2;

// Check for logs using systemd's 'journalctl'
//		journalctl --unit hss-supercollider --follow
// ip.postln;

// NetAddr: the address of the web server
hss.init(NetAddr(ip, 57121));
// Set values
hss.ampMul = hss.amps.maxItem.reciprocal * 0.9;

// Uncomment the next code line if there is no conductor
// among the performers.
// hss.play;
