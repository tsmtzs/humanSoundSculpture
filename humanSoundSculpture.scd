[ "SynthDef.scd", "hssEvent.scd" ].do (_.loadRelative);

// voices per server
// an array of the form server1, voices1, server2, voices2, ...
(
~hss.serverVoicesPairs = [ Server.local, 5 ];
~hss.serverVoicesDict = Dictionary.newFrom( ~hss.serverVoicesPairs );
)

// 1st implementation
(
var normalizeRows, transitionProbs;
var startVertex;
var pat;
var servers, serverSize, serverSizeMO, prob1, prob2;

servers = ~hss.serverVoicesDict.keys.asArray;
serverSize = servers.size;
serverSizeMO = serverSize - 1;
prob1 = [ 0.5, 2.5, \lin ].asSpec;
prob2 = [ 2.5, 0.5, \lin ].asSpec;

normalizeRows = {| anArray2D | anArray2D.collect {|row| row.normalizeSum } };
transitionProbs =  normalizeRows.( ~hss.paley13.value );

startVertex = 13.rand;

pat = Penvir(
	~hss,
	Pbind(
		\instrument, 'sync',			// or \sync2
		\paley, PGraphWalk( transitionProbs, (..12), startVertex ),
		\note, Pfunc {| ev |
			~notes[ ev.paley ]
		},
		\dur, Pfunc {| ev |
			~durs[ ev.paley ] * ~durMul;
		},
		\amp, Pfunc {| ev |
			~amps[ ev.paley ]  * ~ampMul
		},
		\server, Pfunc {| ev |
			var vertex, server;
			vertex = ev.paley / 12;
			server = 0.0.betarand( serverSizeMO, prob1.map( vertex ), prob2.map( vertex ) ).floor;
			servers[ server ]
		},						
		\pan, Pfunc {| ev |
			var serverVoicesNo;
			serverVoicesNo = ~serverVoicesDict[ ev.server ];
			ev.paley.mod( serverVoicesNo )
			.linlin( 0.0, serverVoicesNo - 1, -1.0, 1.0 );
		},
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
		\delta, Pfunc {| ev |
			~deltas[ ev.paley ];
		}
	)
);

pat.play;
)

~hss.push;
~deltaMul = 0.1
~ampMul = 0.01
~durMul = 1;
~deltas = ~durs.linlin( 1/6, 1, 1/8, 7 );
~minOctave = 3;
~maxOctave = 8;
currentEnvironment.pop;

//////////////////////////////////////////////////////////////////////
// 2nd implementation: ( BETTER? )
// all streams are determined by a central
// PGraphWalk

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

pat = ~hss.serverVoicesDict.collect {| voices, server |
	voices.collect {| i |
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
				\server, server,						
				\pan, i.linlin( 0, voices - 1, -1.0, 1.0 ),
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
				\delta, Pfunc {| ev |
					~deltas[ ev.paley ] * ~deltaMul;
				}
			)
		);
	}
}.values.flatten;

Ppar( pat ).play;
)

~hss.push;
~deltas = ~durs;
~deltaMul = 20;
~durMul = 25;
~ampMul = 2.2;
~minOctave = 5;
~maxOctave = 7;
currentEnvironment.pop;
