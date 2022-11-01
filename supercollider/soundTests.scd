// ////////////////////////////////////////////////////////////
//				Human Sound Sculpture
//
// Use this file for sound tests.
// ////////////////////////////////////////////////////////////

(
~hss = (
	notes: [ Rest, 11, 10, 1, 12, 4, 5, 2, 3, 7, 6, 9, 8 ],
	amps: [ 0.07, 0.09 ] ++ [ 0.07, 0.1, 0.07, 0.15, 0.07, 0.2 ].mirror,
	durs: [ 1, 1/2 ] ++ [ 1, 2/3, 1, 3/4, 1, 5/6 ].mirror,

	ampMul: 2.5,
	durMul: 26,
	deltaMul: { [ 0.1.rrand(0.2), 0.55.rrand(0.85), 1.0.rrand(1.1) ].wchoose([0.05, 0.6, 0.35]) },

	edgeFunc: {| ev, i |
		( [ 1, 3, 4 ] * .x [ 1, -1] ).collect {| elem |
			(i+elem).mod(13)
		};
	},

	paley13: {| ev |
		Array.fill( 13, {|i|
			( 0 ! 13 ).putEach( ev.edgeFunc( i ), 1 )
		})
	},

	minOctave: {| ev, aServer, aFloat |	// aFloat \in [-1.0, 1.0]
		6
	},
	maxOctave: {| ev, aServer, aFloat |	// aFloat \in [-1.0, 1.0]
		8
	}
);
)

"SynthDefs.scd".loadRelative;

(
var normalizeRows, transitionProbs;
var startVertex;
var pat, paleyStream;
var prob1, prob2;

prob1 = [ 0.5, 2.5, \lin ].asSpec;
prob2 = [ 2.5, 0.5, \lin ].asSpec;

normalizeRows = {| anArray2D | anArray2D.collect {|row| row.normalizeSum } };
transitionProbs =  normalizeRows.( ~hss.paley13.value );

startVertex = 13.rand;
paleyStream = PGraphWalk( transitionProbs, (..12), startVertex ).asStream;

~pattern = Penvir(
	~hss,
	Pbind(
		\instrument, 'sync2',
		\paley, Pfunc { paleyStream.next },
		\midinote, Pfunc {| ev |
			(ev.paley == 0).if({ Rest }, { 72 + ~notes[ev.paley] + [0, 12].choose })
		},
		\dur, Pfunc {| ev |
			~durs[ ev.paley ] * ~durMul;
		},
		\amp, Pfunc {| ev |
			~amps[ ev.paley ]  * ~ampMul
		},
		\pan, Pfunc { 1.0.rand2 },
		\delta, Pkey(\dur) * Pfunc { |ev| ~deltaMul.value.debug("DeltaMul inside Penvir") }
		// \legato, Pfunc { |ev| ~deltaMul.value.debug("legato inside Penvir") }
	)
)
)

~pattern.play

~hss.amps = [0.0, 0.35, 0.45, 0.35, 0.5, 0.35, 0.75, 0.35, 1, 0.35, 0.75, 0.35, 0.5] * 0.25;
~hss.deltaMul = { [ 0.1.rrand(0.3), 0.5.rrand(0.7), 0.8.rrand(1.0) ].wchoose([0.3, 0.5, 0.2]) };
~hss.deltaMul = {0.1.rrand(0.2)};
~hss.ampMul = ~amps.maxItem.reciprocal * 0.9;
~hss.durMul = 26;

// Record
(
var path = "simulation.aiff";

~pattern.record(path);
)
