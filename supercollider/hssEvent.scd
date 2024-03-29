// ////////////////////////////////////////////////////////////
//				Human Sound Sculpture
//
// This Event schedules the note sequence of the piece.
// ////////////////////////////////////////////////////////////
(
	notes: [Rest, 11, 10, 1, 12, 4, 5, 2, 3, 7, 6, 9, 8],
	amps: [0.07, 0.09] ++ [0.07, 0.1, 0.07, 0.15, 0.07, 0.2].mirror,
	durs: [1, 1/2] ++ [1, 2/3, 1, 3/4, 1, 5/6].mirror,

	ampMul: 1.0,
	durMul: 21,
	deltaMul: { [0.1.rrand(0.4), 0.65.rrand(0.8), 0.8.rrand(1.05)].wchoose([0.25, 0.5, 0.25]) },

	minOctave: { |ev, aServer, aFloat|	// aFloat \in [-1.0, 1.0]
		6
	},
	maxOctave: { |ev, aServer, aFloat|	// aFloat \in [-1.0, 1.0]
		8
	},

	// Given a matrix, this function returns
	// a stochastic matrix
	normalizeRows: { |ev, anArray2D|
		anArray2D.collect { |row| row.normalizeSum }
	},

	// Returns the incidence matrix of a Paley graph
	paley13: { |ev|
		Array.fill( 13, { |i|
			(0 ! 13).putEach(ev.edgeFunc(i), 1)
		})
	},
	edgeFunc: { |ev, i|
		([1, 3, 4] * .x [1, -1]).collect { |elem|
			(i+elem).mod(13)
		};
	},

	init: { |ev, aNetAddr|
		var startVertex = 13.rand, paleyStream, transitionProbs;
		var param1, param2, paleyPbind;

		ev.put(\netAddr, aNetAddr);
		ev.put(\oscFunc, OSCFunc({ |msg, time, addr, recPort|
			msg.postln;
			ev.action(*msg[1..]);
		}, '/action')
		);

		ev.put(\play, { ev.action(\play) });
		ev.put(\stop, { ev.action(\stop) });

		transitionProbs = ev.normalizeRows(ev.paley13);
		param1 = [0.5, 2.5, \lin].asSpec;
		param2 = [2.5, 0.5, \lin].asSpec;

		paleyStream = PGraphWalk(transitionProbs, (..12), startVertex).asStream;

		paleyPbind = Pbind(
			\type, \sendOsc,
			\address, ev.netAddr,
			\paley, Pfunc { paleyStream.next },
			\note, Pfunc { |event|
				ev.notes[event.paley]
			},
			\dur, Pfunc { |event|
				ev.durs[event.paley] * ev.durMul;
			},
			\amp, Pfunc { |event|
				ev.amps[event.paley]  * ev.ampMul
			},
			\octave, Pfunc { |event|
				var vertex, args;
				vertex = event.paley / 12;
				// You need sc3-plugins for the method 'betarand'
				ev.minOctave.(event)
				.betarand(
					ev.maxOctave.(event),
					param1.map(vertex),
					param2.map(vertex)
				).floor
			},
			\delta, Pkey(\dur) * Pfunc { ev.deltaMul.value }
		);

		ev.put(\eventStreamPlayer, EventStreamPlayer(paleyPbind.asStream));
	},

	// actions: play - stop the EventStreamPlayer
	action: { |ev, action ...moreArgs|
		ev.netAddr.sendMsg("/action", action);
		ev.eventStreamPlayer.perform(action);
	},

	freeOSCFunc: {|ev|
		ev.oscFunc.free;
	}
);
