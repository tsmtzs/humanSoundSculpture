~hss = (
	notes: [ Rest, 11, 10, 1, 12, 4, 5, 2, 3, 7, 6, 9, 8 ],
	amps: [ 0.07, 0.09 ] ++ [ 0.07, 0.1, 0.07, 0.15, 0.07, 0.2 ].mirror,
	durs: [ 1, 1/2 ] ++ [ 1, 1/3, 1, 1/4, 1, 1/6 ].mirror,

	ampMul: 2.5,
	durMul: 20,
	deltaMul: 1/4,

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
		3
	},
	maxOctave: {| ev, aServer, aFloat |	// aFloat \in [-1.0, 1.0]
		7
	}
).
make {
	~deltas = ~durs.linlin( 1/6,1, 1/10, 1 );
}