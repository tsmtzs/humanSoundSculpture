// hssEvent.scd file adds the eventType /sendOsc to Event
// and populates the current environment with the ~hss event
"hssEvent.scd".loadRelative;

// NetAddr: the address of the web server
// ~hss.init( NetAddr("127.0.0.1", 57121) );
~hss.init( NetAddr("localhost", 57121) ); // Assumes SupperCollider and web server are on the same machine
// Set values
~hss.durMul = 1.5;
~hss.ampMul = 1.2;


// ~hss.play;
// ~hss.deltaMul = { [ 0.1.rrand(0.2), 0.55.rrand(0.85), 1.0.rrand(1.1) ].wchoose([0.05, 0.6, 0.35]) };
// ~hss.minOctave = 6;
// ~hss.maxOctave = 8;
// ~hss[\stop].();