# Preparing a performance
*Human Sound Sculpture* depends on a local WIFI TLS network. Performers
connect with their smartphone and visit the website of the piece. A
dedicated computer assigns IP addresses to clients, runs the web server and
generates note events. All software configuration should be
done on this computer. We have used the `Raspberry Pi model B+` single board
computer with `Raspberry Pi OS Lite` operating system. In the following sections
all commands assume the `Raspberry Pi OS`.

**Table of Contents**

1. [Required software](#required-software)
2. [Branch off `master`](#branch-off-master)
3. [Global variables](#global-variables)
4. [Network configuration](#network-configuration)
5. [DHCP server configuration](#dhcp-server-configuration)
6. [`Hostapd` configuration](#hostapd-configuration)
7. [TLS certificate](#tls-certificate)
8. [`SuperCollider` configuration](#supercollider-configuration)
9. [Web server configuration](#web-server-configuration)
10. [Putting it all together](#putting-it-all-together)
11. [Troubleshooting](#troubleshooting)

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
	guide to install it on `Raspberry Pi`. *Human Sound Sculpture* utilizes only the `sclang`
	`SuperCollider` language program.

	The `SimpleNumber` method `betarand` is used to calculate some probabilities. It is an extension of the class
	found in `sc3-plugins`.  Install the plugins by following [this](https://supercollider.github.io/sc3-plugins/) guide.
	Alternatively, you could download only the file
	[ProbabilityDistributions.sc](https://github.com/supercollider/sc3-plugins/blob/dd092a20cb66fc976d47ad402be601985cb8bf84/source/LoopBufUGens/sc/classes/LJP%20Classes/ProbabilityDistributions.sc)
	inside the `SuperCollider` user extension directory. This is, usually, `~/.local/share/SuperCollider/Extensions`. You can find it by calling
	`Platform.userExtensionDir` from within `SuperCollider`.

	The class `PGraphWalk` is a extension of the language. It can be found in the github repository [sc-tsmtzs](https://github.com/tsmtzs/sc-tsmtzs).
	Clone the repository inside the `SuperCollider` user extension directory.

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
HSS_HTTP_PORT	$HSS_HTTP_PORT
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
to find the location of `dhcpd`. Save this under `/usr/lib/systemd/system/`
```bash
sudo cp systemd/dhcpd4@.service /usr/lib/systemd/system
```

Reload the `systemd` configuration and start the `dhcpd4@` service by passing the wifi
interface device name
```bash
sudo systemctl daemon-reload
sudo systemctl start dhcpd4@wlan0.service
```
## `Hostapd` configuration
The `systemd` service file [`hostapd@.service`](systemd/hostapd@.service) handles the `hostapd`
process. The command
```bash
which hostapd
```
outputs the location of the `hostapd` executable. Make changes, if needed, in the `ExecStart` option
of [`hostapd@.service`](systemd/hostapd@.service) (line 20). Copy this file to `/usr/lib/systemd/system`
and reload the `systemd` configuration
```bash
sudo cp systemd/hostapd@.service /usr/lib/systemd/system/
sudo systemctl daemon-reload
```

`Hostapd` configuration is bound to the wifi interface device `wlan0`. Rename the file
[`hostapd-wlan0.conf`](conf/hostapd-wlan0.conf) by replacing the device name. Next, open the file
and set the `interface` option to `wlan0` (line 11). The name for our wifi network is set in
line 17 with the `ssid` option. Our network will be named `pi`. You might want to set the option
`country_code` in line 9. Save your changes and copy this file to `/etc/hostapd/`
```bash
sudo cp conf/hostapd-wlan0.conf /etc/hostapd/
```

Now, start the `hostapd@` service, passing the wifi interface name
```bash
sudo systemctl start hostapd@wlan0.service
```
## TLS certificate
Create the directory `certs` under `humanSoundSculpture` and change directory to it.
```bash
mkdir certs && cd certs
```
Inside `certs` we will save the certificates for *Human Sound Sculpture*. Run the command
```bash
mkcert -key-file hss-key.pem -cert-file hss-crt.pem localhost ::1 <HSS_IP>
```

where `<HSS_IP>` is `192.168.100.1` in our case. Now, install the root certificate with
```bash
mkcert -install
```

Web clients should install the root certificate. This is the `rootCA.pem` file located under `mkcert -CAROOT`.
Copy this file to `public/`.
```bash
# First, change directory to humanSoundSculpture
cd ..
# Then copy root certificate
cp $(mkcert -CAROOT)/rootCA.pem public/
```
In most cases, clients should be able to install the certificate to their trust store by using the browser
to navigate to `https://HSS_IP:HSS_HTTP_PORT/rootCA.pem`.
## `SuperCollider` configuration
The file [humanSoundSculpture.scd](supercollider/humanSoundSculpture.scd) generates the note
sequence that is distributed among the performers. It is started with the `systemd` unit
[`hss-supercollider.service`](systemd/hss-supercollider.service). Copy this file to `/usr/lib/systemd/system/`.
```bash
sudo cp systemd/hss-supercollider.service /usr/lib/systemd/system/
```
## Web server configuration
We are going to use the TLS certificate `hss-crt.pem` and key `hss-key.pem`. These were generated with `mkcert` and
are located under `certs`. Open the file [`server.js`](server.js). Lines 18-19, should read these files.

[`Server.js`](server.js) listens to `WebSocket` messages from web clients. If the message is `shutdown` will
call the `bash` script [`killHSS`](bin/killHSS.sh). This message is signaled by the *conductor* of the performance
after double-clicking the `shutdown` button. The idea here is to be able to shutdown the computer (a `Raspberry Pi` in
our case) withoud the need of a keyboard, a monitor or a person different than the performers.

In line 13 of [`killHSS`](bin/killHSS.sh) calls we read `shutdown now;`.
This line is commented by default. Uncomment it for a live performance.

The `systemd` unit `hss-web-server.service` starts the web server process of the piece. Copy the file
[`hss-web-server.service`](systemd/hss-web-server.service) to `/usr/lib/systemd/system`.
```bash
sudo cp systemd/hss-web-server.service /usr/lib/systemd/system/
```
## Putting it all together
