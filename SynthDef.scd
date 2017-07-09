SynthDef('sync',{| out = 0, freq = 400, amp = 0.1, pan = 0.0 |
	var sig, env;
	env = EnvGen.kr(
		Env.linen( Rand(0.5, 4.0), Rand(3.0, 7.0), Rand(2.0, 3.0) ),
		doneAction: 2
	);
	sig = SyncSaw.ar(
		freq, 
		SinOsc.ar(1/11, 0, mul: freq*0.5, add: freq*2 ),
		mul: 0.1);
	sig = CombN.ar(sig, 0.1, 0.1, 2, 1);
	sig = LPF.ar( sig, LinExp.kr( env*amp, 0, 1, 600, 12000 ) );
	sig = sig*env; 
	Out.ar( out, Pan2.ar( sig*0.8, pan, amp ) )
}).add;

SynthDef('sync2',{| out = 0, freq = 400, amp = 0.1, pan = 0.0, dur = 1.0 |
	var sig, env;
	env = EnvGen.kr(
		// Env.linen( Rand(0.5, 4.0), Rand(3.0, 7.0), Rand(2.0, 3.0) ),
		Env.sine( dur ),
		doneAction: 2
	);
	sig = SyncSaw.ar(
		freq, 
		SinOsc.ar(1/11, 0, mul: freq*0.5, add: freq*2 ),
		mul: 0.1);
	sig = CombN.ar(sig, 0.1, 0.1, 2, 1);
	sig = LPF.ar( sig, LinExp.kr( env*amp, 0, 1, 600, 12000 ) );
	sig = sig*env; 
	Out.ar( out, Pan2.ar( sig*0.8, pan, amp ) )
}).add;