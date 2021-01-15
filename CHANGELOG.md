# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] - ???

___

## [2.0] - 2019-08-31
### Added
- Global parameters are listed in file `bin/commonParameters`. Parameter name-value pairs
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
