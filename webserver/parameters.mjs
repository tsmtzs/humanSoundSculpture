// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//    by Tassos Tsesmetzis
// ////////////////////////////////////////////////////////////
import { ORIGIN } from './origin.mjs'

const PARAMETERS = {
  IP: ORIGIN.IP ?? '192.168.10.6',
  WEB_SERVER_PORT: ORIGIN.PORT ?? 3000,
  NOTE_WALK: {
    ADJACENCY_LIST: [
      [1, 3, 4, 9, 10, 12],
      [0, 2, 4, 5, 10, 11],
      [1, 3, 5, 6, 11, 12],
      [0, 2, 4, 6, 7, 12],
      [0, 1, 3, 5, 7, 8],
      [1, 2, 4, 6, 8, 9],
      [2, 3, 5, 7, 9, 10],
      [3, 4, 6, 8, 10, 11],
      [4, 5, 7, 9, 11, 12],
      [0, 5, 6, 8, 10, 12],
      [0, 1, 6, 7, 9, 11],
      [1, 2, 7, 8, 10, 12],
      [0, 2, 3, 8, 9, 11]
    ],
    START_VERTEX: 1,
    STEPS: Infinity,
    // FREQS[0] -> C, FREQS[1] -> C#, etc.
    FREQS: [
      [523.2511306012, 1046.5022612024, 2093.0045224048],
      [554.36526195374, 1108.7305239075, 2217.461047815],
      [587.32953583482, 1174.6590716696, 2349.3181433393],
      [622.25396744416, 1244.5079348883, 2489.0158697766],
      [659.25511382574, 1318.5102276515, 2637.020455303],
      [698.45646286601, 1396.912925732, 2793.825851464],
      [739.98884542327, 1479.9776908465, 2959.9553816931],
      [783.9908719635, 1567.981743927, 3135.963487854],
      [830.60939515989, 1661.2187903198],
      [880, 1760],
      [932.32752303618, 1864.6550460724],
      [987.76660251225, 1975.5332050245]
    ],
    AMPS: [0.35, 0.45, 0.35, 0.5, 0.35, 0.75, 0.35, 1, 0.35, 0.75, 0.35, 0.5],
    DURS: [1, 0.5, 1, 2 / 3, 1, 0.75, 1, 5 / 6, 1, 0.75, 1, 2 / 3, 1],
    AMP_MULTIPLIER: 1.0,
    DUR_MULTIPLIER: 26.0,
    DELTA: dur => {
      const random = Math.random()
      const lowerBounds = [0.1, 0.1, 0.1, 0.1, 0.4, 0.4, 0.4, 0.4, 0.8, 0.8]
      const lowerBound = lowerBounds[Math.floor(Math.random() * 10)]
      const delta = lowerBound * random + 0.2
      return dur * delta
    }
  }
}

export { PARAMETERS }
