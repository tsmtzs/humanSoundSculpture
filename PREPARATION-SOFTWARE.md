# Preparing a performance
*Human Sound Sculpture* depends on a local WIFI TLS network. Performers use
their smartphone to connect to this and visit the website of the piece. A
dedicated computer assigns IP addresses to clients, runs the web server and
generates note events. All software configuration of this work should be
done on this computer. We have used the `Raspberry Pi model B+` single board
computer with `Raspberry Pi OS Lite` operating system. In the following sections
all commands assume the `Raspberry Pi OS`.

**Table of Contents**

- [Required software](#required-software)
- [Configuration](#configuration)

## Required software
1. `Linux`

   `Raspberry Pi OS` is a `Debian` based operating system. Before installing any
   new software, might be a good idea to update and upgrade your system.

   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```
2. [`systemd`](https://systemd.io/)

	`systemd` is a service manager for `Linux`. Normally, this comes by default with
	the operating system.
3. [`bash`](https://www.gnu.org/software/bash/)

	The configuration for *Human Sound Sculpture* is done with the `bash` shell.
	It should come with the operating system.
4. [`sed`](https://www.gnu.org/software/sed/)

	`sed` is a command line stream editor. Should be available with the operating
	system. It is used in the scripts [names2values](bin/names2values.sh) and
	[values2names](bin/values2names.sh).
5. [`hostapd`](https://w1.fi/hostapd/)

	This program is used to turn the wifi network interface card of the computer into
	an access point. Install it with

	```bash
	sudo apt-get install hostapd
	```
6. [`dhcpd`](https://www.isc.org/dhcp/) version `4.4.2`

	This the ISC DHCP server. It is used to assign IP addresses to web clients. Install it with
	(runs automatically at boot time? - Check)

	```bash
	sudo apt-get install isc-dhcp-server
	```
7. [`node.js`](https://nodejs.org/) version ???

	`node.js` is a `JavaScript` runtime environment. The web server for *Human Sound Sculpture* is
	developed on it. Install `node.js` with

	```bash
	sudo apt-get install nodejs
	```
8. [`SuperCollider`](https://supercollider.github.io/) version ???

	`SuperCollider` is an audio programming language. Follow
	[this](https://github.com/supercollider/supercollider/blob/develop/README_RASPBERRY_PI.md)
	guide to install it on your system. *Human Sound Sculpture* utilizes only the `sclang`
	`SuperCollider` language program.
9. [`mkcert`](https://github.com/FiloSottile/mkcert)

	The website of the piece is served on a local TLS network. You can create a TLS certificate
	with the program `mkcert`. To install it follow the directions in [here](https://github.com/FiloSottile/mkcert#installation).
10. (*optional*) [`XeTeX`](https://tug.org/xetex/)

	`XeTeX` is a `TeX` derivative. It used to produce the `PWA` [icon](public/icons/hssIcon_192x192.png)
	of the piece. If you would like to modify this picture, you can install it with

	```bash
	sudo apt-get install texlive
	```
11. (*optional*) [`tikz`](https://github.com/pgf-tikz/pgf)

	This is a `TeX` package for creating graphics. It is part of the `texlive` distribution.
12. (*optional*) [`ffmpeg`](https://ffmpeg.org/) version `4.3.1`

	`ffmpeg` is a program for handling multimedia files. It is used in the `bash` script
	[`multiresize`](bin/multiresize.sh) to resize a given picture file. Will be usefull if
	you want to modify the `PWA` icon of the piece. Intall it with

	```bash
	sudo apt-get install ffmpeg
	```

## First steps
