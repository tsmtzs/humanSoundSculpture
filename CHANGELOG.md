# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Removed

## [4.1.0] - 2023-08-31
### Changed
	- File `src/public/styles.css`:
		- Selector `:root`:
			- Declaration for `--normal-font-size` removed.
			- Declaration `--font-color` added.
		- `html`:
			- Declarations for `font-family`, `height` added.
		- `body`:
			- Declarations for `height`, `margin`, `padding` added.
			- `color` value changed.
		- `#flex-container`:
			- Value of `height` changed.
		- `button`:
			- Values of `color`, `border` changed.
			- Declarations for `height`, `max-height`, `min-width`, `max-width`, `font-size` added.
		- `section`:
			- `max-width` changed.
			- `margin-*` replaced by `margin`.
		- Rulesets for `section h2 + p`, `a:hover, a:active`, `@media` added.
		- `section p`:
			- `margin-*` replaced by `margin`.
	- Files `webclient/views/*.html`:
            - A `meta` element width `name=description` added to `head`.
            - A `header` element added to `body` with the `h1` element as a child.
			- Types corrected in `webclient/views/description.html`.

## [4.0.0] - 2022-11-01
### Added
- Files `webclient/javascript/common.mjs`, `webclient/javascript/conductor.mjs`, `webclient/javascript/functions.mjs`, `webclient/javascript/index.mjs`, `webclient/javascript/parameters.mjs`, `webclient/javascript/player.mjs`.
	A redesign of `JavaScript` code from the deleted `hss.mjs` file.
- File `webclient/javascript/sound.mjs`.
	Class `WaveShaper` is a re-write of the class `Sound` from the deleted `src/public/javascript/sound.mjs` file.
- File `src/web/origin-src.mjs`.
	This is used by `make` to generate `webserver/origin.mjs` and `webclient/origin.mjs`. It defines an object with properties `IP` and `PORT`.
- File `webclient/views/offline.html`.
	This page is served by service worker when the client is offline.
- File `webserver/app.mjs`.
	`Express` app separated from web server.
- Files `webserver/functions.mjs`, `webserver/parameters.mjs`.
- Files `webserver/noteWalk.mjs`, `webserver/randomWalkOnGraph.mjs`, `webserver/directedGraph.mjs`.
	These files are used in a `node` worker thread. They define and handle a random walk on a graph that produces the note sequence. They replace the `SuperCollider` event stream which was responsible for the generation of sound events.
### Changed
- File `src/conf/dhcpd.conf` renamed as `src/conf/dhcpd-src.conf`.
	Fixed address for the host `hssComputer` changed to `${HSS_IP}`.
- FIle `src/conf/hostapd-wlan0.conf` renamed as `src/conf/hostapd-src.conf`.
- File `src/systemd/10-wlan0.network` renamed as `src/systemd/10-wifi-src.network`.
- File `src/systemd/dhcpd4@.service` renamed as `src/systemd/dhcpd4@-src.service`.
- File `src/systemd/hostapd@.service` renamed as `src/systemd/hostapd@-src.service`.
	The `hostapd` process reads the configuration file from `/etc/hostapd/`.
- File `src/systemd/hss-web-server.service` renamed as `src/systemd/hss-web-server-src.service`.
- Files `src/public/hss.webmanifest`, `src/public/icons/`, `src/public/styles.css`, `src/public/views/`, `src/public/sw.js` moved under `webclient`.
	Buttons in pages `conductor.html` and `player.mjs` arranged using the `flexbox` layout model. Code refinements.
- File `tex/hssIcon.tex`.
	The `standalone` document class is used. Code refinements.
- File `makefile`.
	Largely re-written.
### Removed
- File `bin/killHSS.sh`.
- Directory `src/public/javascript`.
- File `src/systemd/hss-supercollider.service`.
- Files `supercollider/HelpSource/`, `supercollider/hssEvent.scd`, `supercollider/humanSoundSculpture.scd`.
	`SuperCollider` is not a dependence for the piece.

## [3.1.1] - 2021-08-11
### Changed
- `Node.js` package `node-osc` upgraded to version `5.2.3`.
- `Node.js` package `ws` upgraded to version `ws`.
- Constructor of `HSS_WSS` assigns the property `clientTracking: true` to the given argument object.

## [3.1.0] - 2021-06-27
### Added
- `GNU make` is used. New file `makefile`.
- Directory `src`.
- Web server and client `JavaScript` adheres to the `JavaScript Standard Style`.
### Changed
- File `SOFTWARE-SETUP.md`.
- Directories `webserver`, `conf`, `systemd` and `public` moved under `src`.
### Removed
- `Bash` scripts `bin/names2values.sh` and `bin/values2names.sh`.
- File `bin/hss-variables`.

## [3.0.0] - 2021-01-18
### Added
- *Human Sound Sculpture* adopts [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
- File `CONTRIBUTING.md`.
- File `PERFORMANCES.md`.
- File `SOFTWARE-SETUP.md`.
- File `TODO.org`.
- File `systemd/10-wlan0.network`.
- File `webserver/hss-wss.js`.
- `Bash` script `bin/multiresize.sh`.
- `Bash` script `bin/pic2json.sh`.
- `Hostapd` Configuration file `conf/hostapd-wlan0.conf`.
- A `PWA` website. New files `public/sw.js`, `public/hss.webmanifest`.
- New `JavaScript` modules `public/javascript/sound.mjs` and `public/javascript/functors.mjs`.
- New web pages `public/views/description.html` and `public/views/player.html`.
- `systemd` unit files `systemd/dhcpd4@.service`, `systemd/hostapd@.service`, `systemd/hss-supercollider.service` and `systemd/hss-web-server.service`.
- `XeLaTeX` file `tex/hssIcon.tex`.

### Changed
- File `README.md`.
- File `bin/commonParameters` renamed as `bin/hss-globalVariables`.
- File `bin/killHSS.sh`. The script runs one command: `shutdown now;`.
- File `public/hss.js` moved under `public/javascript`.
- File `server.js` moved under `webserver`.
- Files `views/index.html` and `views/conductor.html` moved under `public/views/`.
- `Bash` script `bin/writeParValues.sh` renamed as `bin/names2values.sh`.
- `Bash` script `bin/writeParNames.sh` renamed as `bin/values2names.sh`.
- Occurances of global variables are prefixed by `$`.
- Global variable `HSS_NETWORK` used in `conf/dhcpd.conf`.

### Removed
- `Bash` script `bin/startHSS.sh`.
- Configuration file `conf/hostapd.conf`.
- File `notesHSS.org`.
- Unit `systemd/hss.service`.

___

## [2.0] - 2019-08-31
### Added
- Global parameters are listed in file the `bin/commonParameters`. Parameter name-value pairs
are listed in columns. Pairs are written in different lines.
- `Bash` script `bin/writeParValues.sh`. It reads `bin/commonParameters` and changes names with
values in all the relevant files.
- `Bash` script `bin/writeParNames.sh`. It reads `bin/commonParameters` and changes parameter values to
names.
- `Bash` script `bin/startHSS.sh`. It starts the web server and `SuperCollider` processes. It is added
to `crontab` and scheduled to run on boot.
- `Bash` script `bin/killHSS.sh`. It kills the `SuperCollider` and `node.js` processes, and shuts the
computer down.
- The `systemd` unit file `systemd/hss.service`. It starts the web server and `SuperCollider` processes.
- Files `soundTests.scd` and `SynthDefs.scd` under `supercollider`. To be used for sound tests.
- File `README.md`.
- The package depends on the programs `hostapd` and `dhcp`. The configuration is discribed in `notesHSS.org`.
- An `HTML` error handling listener added in `server.js`.
- An `HTML` button with value `shutdown` added in `views/conductor.html`.
- A `dbclick` event listener added in `publlic/hss.js`.

### Changed
- File `public/functions.js` renamed as `public/hss.js`.
- The `node.js` package `node-osc` used for `WebSocket` communication between web server and the web clients. Package
`osc` removed.

## [1.0] - 2017-07-30
### Added
- File `server.js`.
- File `public/functions.js`.
- File `public/styles.css`.
- File `supercollider/tests.scd`.
- File `views/index.html`.
- File `views/coductor.html`.
- File `supercollider/hssEvent.scd`: Pseudo methods `init`, `edgeFunc`, `action` and `freeOSCFunc`
added in the `SuperCollider` `Event`.

### Changed
- Files `hssEvent.scd`, `humandSoundSculpture.scd`, `HelpSource/Guide/*` moved under `supercollider`.

### Removed
- File `supercollider/SynthDef.scd`.

## [0.1] - 2017-07-09
### Added
- File `humandSoundSculpture.scd`.
- File `hssEvent.scd`.
- File `SynthDef.scd`.
- File `HelpSource/Guides/humanSoundSculpture.schelp`.
- File `HelpSource/Guides/humanSoundSculpture_gr.schelp`.
