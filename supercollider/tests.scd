~actionOSCFunc = OSCFunc({|msg, time, addr, recPort|
	msg.postln;
	currentEnvironment.at(msg.last).();
	// currentEnvironment.at(\action).(msg.last);
}, '/action');

~netAddr = NetAddr("127.0.0.1", 57121);

Event.addEventType(\sendOsc, {
	~address.sendMsg("/note", ~freq.(), ~amp, ~dur);
});

(
~graphWalk = Pbind(
	\type, \sendOsc,
	\address, ~netAddr,
	\note, Pfunc { rrand(1, 10) },
	\octave, Prand( (5..7), inf),
	\amp, Pfunc { rrand(0.1, 0.42) },
	\dur, Pfunc { rrand(2.0, 5.0) },
	\delta, Pkey(\dur) * Pfunc { 1.0.rrand(2.0)}
);

~eventStreamPlayer = EventStreamPlayer(~graphWalk.asStream);

~play = {
	~netAddr.sendMsg("/action", "play");
	~eventStreamPlayer.play;
};

~stop = {
	~netAddr.sendMsg("/action", "stop");
	if (~eventStreamPlayer.isPlaying) {
		~eventStreamPlayer.stop;
	};
};

~action = {|action|
	~netAddr.sendMsg("/action", action);
	~eventStreamPlayer.perform(action);
};
)

~play.();
~stop.();