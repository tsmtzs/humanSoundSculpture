# *Human Sound Sculpture*

## About
*Human Sound Sculpture* is a piece of performance art for public space. It is based on the *text score*:
```
	   Night.

	   People with wooden faces. Moving towards the same point.
	   One behind the other. Close enough or far apart.

	   Time stands still.
```

A group of people arranged in a line is moving towards a point. The spectator faces a snapshot of this proccess. The ambient soundscape is part of the piece. Along with it, a random endless sequence of notes unfolds. This sequence is distributed over the smartphone devices of the performers.

The piece should be played outdoors in places like city parks, town squares, etc. This place must be quiet enough so that the overall amplitude of the piece stays in relative low levels and the frozen atmosphere is not destroyed.

The performance simply starts and lasts as long as the performers have decided. Similarly, the performance simply stops and the performers are leaving silently taking distinct paths.

*Human Sound Sculpture*, despite it's static form, deals with motion. The relentless motion of *Time*. Which interwines with the footsteps of passers-by. With the roar of the city. With the thoughts, dreams, memories and aspirations of the people that stand frozen in the row.

## Technicalities
Each performer of *Human Sound Sculpture* carries a smartphone. This device is used as a loudspeaker and should be as less visible as possible. It is connected to a local WIFI TLS network. Using the browser, each performer loads the website of the piece. She stays connected until performance ends. The steps of connecting to the network and loading the website must be done before performance starts and is not part of the piece.

The website is not accessible throught the `Internet`. Rather, it is served on a local network. The web server process runs on a dedicated computer. A portable solution, like a `Rasberry Pi` with a USB power bank, is preferred since it can fit inside a bag or a pocket. This computer should host a `Linux` environment with the `systemd` service manager. Also, utilizes `hostapd` to enable the network interface card to act as an access point.

Four pages constitute the website of the piece. They are tagged as *index*, *description*, *player* and *conductor*. The first serves as a gateway to the rest. *Description* offers a brief description of the piece. The pages *conductor* and *player* are used in a performance. Each performer connects to exactly one of them. She is tagged as *conductor* or *player*, respectively. Each performance has exactly one *conductor*.

The *conductor* is responsible for starting and ending the performance. Two buttons can be used for these. The first one takes the values `start`/`stop` and starts/stops the generation of sound events. The second buttom holds the value `shutdown`. It kills the web server process and shuts down the computer were the server is running.

### Web Server
The web server is written in [`node.js`](https://nodejs.org/en/). It distributes note events to web clients using `WebSockets`.

The web server is developed with [`express`](https://expressjs.com/). The package [`ws`](https://github.com/websockets/ws) is used for `WebSockets`.

The web server process is started by a `systemd` service.

### Web Clients
In a performance clients should visit one of the pages *conductor* or *player*. In both cases receive `WebSocket` messages from the web server. Specifically, when a client receives an object `{ type: 'note', args: [freq, amp, dur] }`, it plays a synth with `freq`, `amp` and `dur` as arguments.

The *conductor* sends `WebSocket` messages to the web server. These are
- `play`/`stop`: Send when the conductor presses the `play` button. They are used to start/stop, the note generation event stream.
- `shutdown`: Send when the `shutdown` button is pressed. It is used to poweroff the computer.

## Prepare a performance
The document [SOFTWARE-SETUP](SOFTWARE-SETUP.md) describes the necessary steps required for configuring the software components of the piece. Other details about a perfomance can be found in [PREPARATION](PREPARATION.md). If you realized a public performance and you would like to mention it here, please, refer to [PERFORMANCES](PERFORMANCES.md).

## Contribute
This project is open to contribution. Please direct to [CONTRIBUTING](CONTRIBUTING.md) for more details. Some of the things that we will like to do in our project can be found in [TODO](TODO.org).

## License
[![License: CC BY-SA 4.0](https://licensebuttons.net/l/by-sa/4.0/80x15.png)](https://creativecommons.org/licenses/by-sa/4.0/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Human Sound Sculpture* is distributed under the terms of the
[Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/legalcode), except the code which is distributed under the terms of the [MIT License](MIT-LICENSE.md).
