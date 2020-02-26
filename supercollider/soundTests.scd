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

Penvir(
	~hss,
	Pbind(
		\instrument, 'sync2',			// or \sync2
		\paley, Pfunc { paleyStream.next },
		\note, Pfunc {| ev |
			~notes[ ev.paley ]
		},
		\dur, Pfunc {| ev |
			~durs[ ev.paley ] * ~durMul;
		},
		\amp, Pfunc {| ev |
			~amps[ ev.paley ]  * ~ampMul
		},
		\pan, Pfunc {1.0.rand2},
		\octave, Pfunc {| ev |
			var vertex, args;
			vertex = ev.paley / 12;
			args = [ ev.server, ev.pan ];
			~minOctave.( currentEnvironment, *args )
			.betarand(
				~maxOctave.( currentEnvironment, *args ),
				prob1.map( vertex ),
				prob2.map( vertex )
			).floor
		},
		\delta, Pkey(\dur) * Pfunc { |ev| ~deltaMul.value.debug("DeltaMul inside Penvir") }
	)
).play
)

~hss.push;
~deltaMul = { [ 0.1.rrand(0.4), 0.65.rrand(0.8), 0.8.rrand(1.05) ].wchoose([0.15, 0.5, 0.35]) };
~deltaMul = {0.1.rrand(0.2)};
~ampMul = ~amps.maxItem.reciprocal * 0.7;
~durMul = 27;
~minOctave = 6;
~maxOctave = 7;
currentEnvironment.pop;