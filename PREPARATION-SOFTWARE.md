# Preparing a performance
*Human Sound Sculpture* depends on a local WIFI TLS network. Performers
connect with their smartphone and visit the website of the piece. A
dedicated computer assigns IP addresses to clients, runs the web server and
generates note events. All software configuration should be
done on this computer. We have used the `Raspberry Pi model B+` single board
computer with `Raspberry Pi OS Lite` operating system. In the following sections
all commands assume the `Raspberry Pi OS`.

**Table of Contents**

- [Required software](#required-software)
- [Branch off `master`](#branch-off-master)
- [Global variables](#global-variables)
- [Network configuration](#network-configuration)
- [DHCP server configuration](#dhcp-server-configuration)
- [`Hostapd` configuration](#hostapd-configuration)
- [TLS certificate](#tls-certificate)
- [`SuperCollider` configuration](#supercollider-configuration)
- [Web server configuration](#web-server-configuration)
- [Putting it all together](#putting-it-all-together)
- [Troubleshooting](#troubleshooting)

## Required software
1. `Linux`

   `Raspberry Pi OS` is a `Debian` based operating system. Before installing any
   new software, might be a good idea to update and upgrade your system.

   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```
2. [`systemd`](https://systemd.io/)

	`systemd` is a service manager for `Linux`. Normally, this comes with
	the operating system.
3. [`bash`](https://www.gnu.org/software/bash/)

	The configuration for *Human Sound Sculpture* is done within the `bash` shell.
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
	with the program `mkcert`. To install it follow the directions found [here](https://github.com/FiloSottile/mkcert#installation).

10. [`git`](https://git-scm.com/)

	A new `git branch` is created for every performance or test of *Human Sound Sculpture*. Install `git` by running

	```bash
	sudo apt-get install git
	```
11. (*optional*) [`XeTeX`](https://tug.org/xetex/)

	`XeTeX` is a `TeX` derivative. It is used to produce the `PWA` [icon](public/icons/hssIcon_192x192.png)
	of the piece. If you would like to modify this picture, you can install it with

	```bash
	sudo apt-get install texlive
	```
12. (*optional*) [`tikz`](https://github.com/pgf-tikz/pgf)

	This is a `TeX` package for creating graphics. It is part of the `texlive` distribution.
13. (*optional*) [`ffmpeg`](https://ffmpeg.org/) version `4.3.1`

	`ffmpeg` is a program for handling multimedia files. It is used in the `bash` script
	[`multiresize`](bin/multiresize.sh) to resize a given picture file. Will be usefull if
	you want to modify the `PWA` icon of the piece. Intall it with

	```bash
	sudo apt-get install ffmpeg
	```

## Branch off `master`
At this step you have installed all the necessary software. Open a `bash` terminal and change
directory to an appropriate place.

```bash
# Change to user's home directory
cd
```

Clone the repository and change directory to
`humanSoundSculpture`.

```bash
git clone ?????
cd humanSoundSculpture
```

Make sure you 're on the `master` branch by running

```bash
git branch
```
If this is so, create a new branch on top. Use an appropriate name.
Something like `test` or `test@raspberry` or `performance@venus` might be handy.

```bash
git checkout -b performance@venus
```

## Global variables
The runtime environment of the piece depends on the following variables:
- `HSS_DIR`: An absolute path. Points to the `humanSoundSculpture` directory.
- `HSS_IP`: An IPv4 address. Web server's IP on the local network.
- `HSS_NETWORK`: The network prefix of the local wifi network, i.e. the three
		leftmost bytes of the IP (assuming an IPv4 24 bit netmask).
- `HSS_HTTP_PORT`: A positive integer. The `HTTP` port number.

Set their values by editing the file [hss-globalVariables](bin/hss-globalVariables).

Global variables are scattered accross several files.

*Note*: Global variable names are prepended by a `$` sign. To find all the occurances of a
variable use `grep`. E.x. `grep -r '$HSS_IP'`.

For this guide we will use
```
# bin/hss-globalVariables
HSS_DIR			/home/pi/humanSoundSculpture
HSS_IP			192.168.100.1
HSS_HTTP_PORT	3000
```

After editing
[hss-globalVariables](bin/hss-globalVariables), use the script [`names2values`](bin/names2values.sh)
to replace each occurance of a variable with it's value.

```bash
# names2values accepts 2 arguments.
# 1st arg: a directory. The script will replace variables
#		recursively under this directory.
# 2nd arg: a path to a text file. It collects pairs of the form (variable name) - value.
#
# We run names2values inside humanSoundSculpture passing the file bin/hss-globalVariables
./bin/names2values.sh . bin/hss-globalVariables
```
To revert to variable names, use the script [values2names](bin/values2names). You should not
make any changes to global variable values in order for this to work.

```bash
# values2names accepts the same arguments as names2values.
./bin/values2names.sh . bin/hss-globalVariables
```

## Network configuration
First, find out the name of the wifi interface device name.

```bash
ip link show
```

Normally, the name should start with a `w`. For this guide we will assume
that the device name is `wlan0`. Bring the interface up by running

```bash
sudo ip link set wlan0 up
```

Now we will assign a static IP to `wlan0`. The IP is the value of the `HSS_IP`
global variable, set in [`hss-globalVariables`](bin/hss-globalVariables). In this case,
it is `192.168.100.1`.

We will use the `systemd` service `systemd-networkd`. The configuration for our local
network is done in the file [`10-wlan0.network`](systemd/10-wlan0.network). If the wifi
interface device name is not `wlan0`, you have to rename the file. Open
[`10-wlan0.network`](systemd/10-wlan0.network) and edit, if needed, line 10:
```
# 10-wlan0.network
Name=wlan0
```

After editing, copy [`10-wlan0.network`](systemd/10-wlan0.network) to
`/usr/lib/systemd/network` (see the man pages for `systemd.network` and `systemd-networkd`
for other paths).

```bash
sudo cp systemd/10-wlan0.network /usr/lib/systemd/network/
```

Reload the `systemd` configuration by
```bash
sudo systemctl daemon-reload
```
and start the `systemd-networkd` service.
```bash
sudo systemctl start systemd-networkd
```

Check if the wireless interface is assigned the IP
```bash
ip addr show wlan0
```

## DHCP server configuration
The ISC DHCP server is configured with the file `dhcpd.conf`. This should be located under
`/etc/` or `/etc/dhcp/`. For our purposes, assume it under `/etc/dhcp/`. Start by renaming it
```bash
sudo mv /etc/dhcp/dhcpd.conf /etc/dhcp/dhcpd.conf.original
```

In place of the original configuration file we will use [`dhcpd.conf`](conf/dhcpd.conf). We will
edit the MAC address of the wifi interface. This is a series of hexadecimal bytes
separated by colons. You can find it by inspecting the output of

```bash
ip link show wlan0
```

The MAC adddress is on the second line, on the right of `link/ether`. Add it in line 30 of
[`dhcpd.conf`](conf/dhcpd.conf).

Copy this file under `/etc/dhcp/`
```bash
sudo cp conf/dhcpd.conf /etc/dhcp/
```

The DHCP server process will be handled by a `systemd` service. Open the file
[`dhcpd4@.service`](systemd/dhcpd4@.service). Make sure that the `ExecStart` option holds
the correct paths for the `dhcpd` executable and the `dhcpd.conf` file.
Use
```bash
which dhcpd
```
to find the location of `dhcpd`.

Start the `dhcpd4@` service by passing the wifi interface device name
```bash
sudo systemctl start dhcpd4@wlan0.service
```
## `Hostapd` configuration

## TLS certificate

## `SuperCollider` configuration

## Web server configuration
