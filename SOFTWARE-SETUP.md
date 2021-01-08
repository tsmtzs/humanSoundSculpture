# Software setup
**Table of Contents**

- [Installing and configuring software](#installing-and-configuring-software)\
	i. [Install the required software](#install-the-required-software)\
	ii. [Clone the `humanSoundSculpture` repository](#clone-the-humansoundsculpture-repository)\
	iii. [Work on a separate `git branch`](#work-on-a-separate-git-branch)\
	iv. [Set global variables](#set-global-variables)\
	v. [Generate a TLS certificate](#generate-a-tls-certificate)\
	vi. [Configure the local wifi network](#configure-the-local-wifi-network)\
	vii. [Configure the DHCP server](#configure-the-dhcp-server)\
	viii. [Configure `hostapd`](#configure-hostapd)\
	ix. [Configure `SuperCollider`](#configure-supercollider)\
	x. [Configure the web server](#configure-the-web-server)
- [Putting it all together](#putting-it-all-together)
- [Troubleshooting](#troubleshooting)
- [Preparing a performace](#preparing-a-performace)

## Installing and configuring software
*Human Sound Sculpture* depends on a local WIFI TLS network. Performers
connect with their smartphones and visit the website of the piece. A
dedicated computer assigns IP addresses to clients, runs the web server and
generates note events. All software configuration should be
done on this computer. We have used the `Raspberry Pi model B+` single board
computer with the `Raspberry Pi OS Lite` operating system. The following sections
offer the details for each step of setting up software.
All commands assume the `Raspberry Pi OS`. They should work on every `Debian` based
`Linux` distribution.

### Install the required software
1. `Linux`

   `Raspberry Pi OS` is a `Debian` based operating system. Before installing any
   new software, might be a good idea to update and upgrade your system.

   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```

   Required version: `Raspbian 10`
2. [`systemd`](https://systemd.io/)

	`systemd` is a service manager for `Linux`. Normally, this comes with
	the operating system.

	Required version: `241`
3. [`bash`](https://www.gnu.org/software/bash/)

	The configuration for *Human Sound Sculpture* is done within the `bash` shell.
	It should come with the operating system.

	Required version: `5.0.3`
4. [`sed`](https://www.gnu.org/software/sed/)

	`sed` is a command line stream editor. Should be available with the operating
	system. It is used in the scripts [names2values](bin/names2values.sh) and
	[values2names](bin/values2names.sh).

	Required version: `4.7`
5. [`hostapd`](https://w1.fi/hostapd/)

	This program is used to turn the WIFI network interface card of the computer into
	an access point. Install it with

	```bash
	sudo apt-get install hostapd
	```

	Required version: `2.8-devel`
6. [`dhcpd`](https://www.isc.org/dhcp/) version `4.4.2`

	This the ISC DHCP server. It is used to assign IP addresses to web clients. Install it with
	(runs automatically at boot time? - Check)

	```bash
	sudo apt-get install isc-dhcp-server
	```

	Required version: `4.4.1`
7. [`node.js`](https://nodejs.org/) version ???

	`node.js` is a `JavaScript` runtime environment. The web server for *Human Sound Sculpture* is
	developed on it. Install `node.js` with

	```bash
	sudo apt-get install nodejs
	```

	Required version: `10.21.0`
8. [`SuperCollider`](https://supercollider.github.io/) version ???

	`SuperCollider` is an audio programming language. Follow this
	[raspberry-installation](https://github.com/supercollider/supercollider/blob/develop/README_RASPBERRY_PI.md)
	guide to install it on `Raspberry Pi`. *Human Sound Sculpture* utilizes only the `sclang`
	`SuperCollider` language program.

	The `SimpleNumber` method `betarand` is used to calculate some probabilities. It is an extension of the class
	found in `sc3-plugins`.  Install the plugins by following the [sc3plugin-installation](https://supercollider.github.io/sc3-plugins/) guide.
	Alternatively, you could download only the file
	[ProbabilityDistributions.sc](https://github.com/supercollider/sc3-plugins/blob/dd092a20cb66fc976d47ad402be601985cb8bf84/source/LoopBufUGens/sc/classes/LJP%20Classes/ProbabilityDistributions.sc)
	inside the `SuperCollider` user extension directory. This is, usually, `~/.local/share/SuperCollider/Extensions`. You can find it by calling
	`Platform.userExtensionDir` from within `SuperCollider`.

	The class `PGraphWalk` is a extension of the language. It can be found in the github repository [sc-tsmtzs](https://github.com/tsmtzs/sc-tsmtzs).
	Clone the repository inside the `SuperCollider` user extension directory.

	Required version: `sclang 3.10.0`
9. [`mkcert`](https://github.com/FiloSottile/mkcert)

	The website of the piece is served on a local TLS network. You can create a TLS certificate
	with the program `mkcert`. To install it follow the directions found in [mkcert-installation](https://github.com/FiloSottile/mkcert#installation).

	Another way, although not recommended (read *use at your own risk*), to install `mkcert` is to download the binaries:

		1. Find the `CPU` architecture
		```bash
		dpkg --print-architecture
		```

		This will print, probably, `armhf` on `Raspberry Pi 3`.
		2. Change directory to `/usr/bin/`
		```bash
		cd /usr/bin
		```
		3. Direct to [mkcert pre-build binaries](https://github.com/FiloSottile/mkcert/releases) and download the
		one that matches the output of `dpkg`. We will download the file `mkcert-v1.4.3-linux-arm`
		```bash
		sudo wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-arm
		```
		4. Rename the binary file as `mkcert`
		```bash
		sudo mv mkcert-v1.4.3-linux-arm mkcert
		```
		5. Change `mkcert`'s mode
		```bash
		sudo chmod a=rx mkcert
		```

	Required version: `1.4.3`
10. [`git`](https://git-scm.com/)

	A new `git branch` is created for every performance or test of *Human Sound Sculpture*. Install `git` by running

	```bash
	sudo apt-get install git
	```

	Required version: `2.20.1`
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
	you want to modify the `PWA` icon of the piece. Install it with

	```bash
	sudo apt-get install ffmpeg
	```

### Clone the `humanSoundSculpture` repository
At this step you have installed all the necessary software. Open a `bash` terminal and change
directory to an appropriate place.

```bash
## Change to user's home directory
cd
```

Clone the repository `humanSoundSculpture`.

```bash
git clone ?????
```

### Install `node` packages
First, change directory to `humanSoundSculpture`
```bash
cd humanSoundSculpture
```

Install the required packages with

```bash
npm install
```

### Work on a separate `git branch`
For a performance you should create a new branch on top of `master`.
Make sure you 're on the `master` branch by running
```bash
git branch
```
If this is so, create the new branch. Use an appropriate name.
Something like `test` or `test@raspberry` or `performance@venus` might be handy.

```bash
git checkout -b performance@venus
```

### Set global variables
The runtime environment of the piece depends on the following variables:
- `HSS_DIR`: An absolute path. Points to the `humanSoundSculpture` directory.
- `HSS_IP`: An IPv4 address. Web server's IP on the local network.
- `HSS_NETWORK`: The network prefix of the local WIFI network, i.e. the three
		leftmost bytes of the IP (assuming an IPv4 24 bit netmask).
- `HSS_HTTP_PORT`: A positive integer. The `HTTP` port number.

Set their values by editing the file [hss-globalVariables](bin/hss-globalVariables).

Global variables are scattered accross several files. Variable names are prepended by a `$`
sign. To find all the occurances of a variable use `grep`. E.x. `grep -r '$HSS_IP'`.

For this guide we will use
```
## bin/hss-globalVariables
HSS_DIR			$HSS_DIR
HSS_IP			$HSS_IP
HSS_HTTP_PORT		$HSS_HTTP_PORT
```

After editing
[hss-globalVariables](bin/hss-globalVariables), use the script [`names2values`](bin/names2values.sh)
to replace each occurance of a variable with it's value.

```bash
## names2values accepts 2 arguments.
## 1st arg: a directory. The script will replace variables
#		recursively under this directory.
## 2nd arg: a path to a text file. It collects pairs of the form (variable name) - value.
#
## We run names2values inside humanSoundSculpture passing the file bin/hss-globalVariables
./bin/names2values.sh . bin/hss-globalVariables
```
To revert to variable names, use the script [values2names](bin/values2names). You should not
make any changes to global variable values in order for this to work.

```bash
## values2names accepts the same arguments as names2values.
./bin/values2names.sh . bin/hss-globalVariables
```

### Generate a TLS certificate
Create the directory `certs` under `humanSoundSculpture` and change directory to it.
```bash
mkdir certs && cd certs
```
Inside `certs` you should save the certificates for *Human Sound Sculpture*. Run the command
```bash
mkcert -key-file hss-key.pem -cert-file hss-crt.pem localhost ::1 <HSS_IP>
```

where `<HSS_IP>` is `$HSS_IP` in our case. Now, install the root certificate with
```bash
mkcert -install
```

Web clients should, also, install the root certificate on their device. This is the `rootCA.pem` file
located under `mkcert -CAROOT`. Copy this file to `public/`.
```bash
## First, change directory to humanSoundSculpture
cd ..
## Then copy the root certificate
cp $(mkcert -CAROOT)/rootCA.pem public/
```
In most cases, clients should be able to install the certificate to their trust store by using the browser
to navigate to `https://$HSS_IP:$HSS_HTTP_PORT/rootCA.pem` (in general to`https://HSS_IP:HSS_HTTP_PORT/rootCA.pem`).

### Configure the local WIFI network
At first, find out the name of the WIFI interface device name.
```bash
ip link show
```
Normally, the name should start with a `w`. For this guide we will assume
that the device name is `wlan0`. Bring the interface up, if it is not, by running
```bash
sudo ip link set wlan0 up
```

Now assign a static IP to `wlan0`. This is the value of the `HSS_IP`
global variable, set in [`hss-globalVariables`](bin/hss-globalVariables). In this case,
it is `$HSS_IP`.

We will use the `systemd` service `systemd-networkd`. The configuration options for the local
network are found in the file [`10-wlan0.network`](systemd/10-wlan0.network). If the WIFI
interface device name is not `wlan0`, you should rename this file. Open
[`10-wlan0.network`](systemd/10-wlan0.network) and edit, if needed, line 10:
```
## 10-wlan0.network
Name=wlan0
```

After editing, copy [`10-wlan0.network`](systemd/10-wlan0.network) to
`/lib/systemd/network/` (see the man pages for `systemd.network` and `systemd-networkd`
for other paths).

```bash
sudo cp systemd/10-wlan0.network /lib/systemd/network/
```

### Configure the DHCP server
The ISC DHCP server is configured with the file `dhcpd.conf`. This should be located under
`/etc/` or `/etc/dhcp/`. For our purposes, assume it under `/etc/dhcp/`. Start by renaming it
```bash
sudo mv /etc/dhcp/dhcpd.conf /etc/dhcp/dhcpd.conf.original
```

In place of the original configuration file we will use [`dhcpd.conf`](conf/dhcpd.conf). We will
edit the MAC address of the WIFI interface. This is a series of hexadecimal bytes
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
to find the location of `dhcpd`. Copy this file to `/lib/systemd/system/`
```bash
sudo cp systemd/dhcpd4@.service /lib/systemd/system/
```

### Configure `hostapd`
The `systemd` service file [`hostapd@.service`](systemd/hostapd@.service) handles the `hostapd`
process. The command
```bash
which hostapd
```
outputs the location of the `hostapd` executable. Make changes, if needed, in the `ExecStart` option
of [`hostapd@.service`](systemd/hostapd@.service) (line 20). Copy this file to `/lib/systemd/system/`
```bash
sudo cp systemd/hostapd@.service /lib/systemd/system/
```

`Hostapd` configuration is bound to the WIFI interface device `wlan0`. For a different device name, rename the file
[`hostapd-wlan0.conf`](conf/hostapd-wlan0.conf).
Next, open the file and set the `interface` option to `wlan0` (line 11). The name for our WIFI network is set in
line 17 with the `ssid` option. Our network will be named `pi`. You might want to set the option
`country_code` in line 9. Save your changes and copy this file to `/etc/hostapd/`
```bash
sudo cp conf/hostapd-wlan0.conf /etc/hostapd/
```

### Configure `SuperCollider`
The file [humanSoundSculpture.scd](supercollider/humanSoundSculpture.scd) is responsible for the note
sequence that is distributed among the performers. It is started with the `systemd` unit
[`hss-supercollider.service`](systemd/hss-supercollider.service). Copy this file to `/lib/systemd/system/`.
```bash
sudo cp systemd/hss-supercollider.service /lib/systemd/system/
```
### Configure the web server
We are going to use the TLS certificate `hss-crt.pem` and key `hss-key.pem`. They were generated with `mkcert` and
are located under `certs`. Open the file [`server.js`](server.js). Lines 18-19, should read these files.

[`Server.js`](server.js) listens to `WebSocket` messages from web clients. If the message is `shutdown` will
call the `bash` script [`killHSS`](bin/killHSS.sh). This message is signaled by the *conductor* of the performance
after double-clicking on the `shutdown` button. The idea here is to be able to shutdown the computer (a `Raspberry Pi` in
our case) without the need of a keyboard, a monitor or a person different than the performers.

In line 13 of [`killHSS`](bin/killHSS.sh) we read `shutdown now;`.
This line is commented by default. Uncomment it for a live performance.

The `systemd` unit `hss-web-server.service` starts the web server process of the piece. Copy the file
[`hss-web-server.service`](systemd/hss-web-server.service) to `/lib/systemd/system/`.
```bash
sudo cp systemd/hss-web-server.service /lib/systemd/system/
```

## Putting it all together
First reload the `systemd` configuration
```bash
sudo systemctl daemon-reload
```
Then start the `systemd` unit `systemd-networkd` to assign a static IP to the WIFI interface device.
```bash
sudo systemctl start systemd-networkd.service
```
Use the unit `hostapd@.service` to turn the network card into an access point. The unit `dhcpd4@.service`
will start the DHCP server. Start both services by passing the WIFI interface device name `wlan0`
```bash
sudo systemctl start hostapd@wlan0.service dhcpd4@wlan0.service
```
Check if the wireless interface is assigned the IP
```bash
ip addr show wlan0
```

Now, start the web server process with the unit `hss-web-server.service` and `SuperCollider` with
`hss-supercollider.service`.
```bash
sudo systemctl start hss-web-server.service hss-supercollider.service
```

> You could start all services with one command\
> `sudo systemctl start systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server hss-supercollider`

By using the browser navigate to `https://$HSS_IP:$HSS_HTTP_PORT`. Hopefully, you will see the *index*
page of *Human Sound Sculpture*.

A `systemd` service is stopped with the command
```bash
sudo systemctl stop <unit-name>
```
To stop all the running processes of the piece use the command
```bash
sudo systemctl stop hss-supercollider hss-web-server hostapd@wlan0 dhcpd4@wlan0 systemd-networkd
```
## Troubleshooting
You can check the status of a `systemd` service with
```bash
sudo systemctl status <unit-name>
```
E.x. the output of `sudo systemctl status systemd-networkd` will print `Active: active (running)` if the process
`systemd-networkd` is running, `Active: inactive (dead)` if the process is not running etc.

If things go wrong, use `journalctl` to query `systemd` logs. Inspecting the output of`sudo journalctl -xe`
or `sudo journalctl -u <unit-name> -r` might reveal usefull information about the unit `<unit-name>`.
Also, might be usefull to start the services one by one and checking, in each step, the status of the
most recently started service.

You can see runtime messages about a service with the command
```bash
sudo journalctl -u <unit-name> -f
```
This approach was found usefull in inspecting `node.js` or `SuperCollider` messages. Use it in
compination with log statements inside web server or `SuperCollider` files. Output from both services can be
printed with
```bash
sudo journalctl -u hss-* -f
```

Sometimes an error may occur in a `systemd` unit file and not in the underlying process, and vice versa. With
`systemd-networkd`, `dhcpd4@wlan0`, `hostapd@wlan0` running, you can start the web server process by calling
`node server.js` (or `sudo node server.js` if the global variable `HSS_HTTP_PORT` is less than 1024).
After any change in the `systemd` service files under `/usr/lib/systemd/system`, you should reload the configuration
of the service manager with
```bash
sudo systemctl daemon-reload
```

We find it usefull to use `ssh` to connect to the *Human Sound Sculpture* computer from another machine. Use the
browser to navigate to piece's website. Open multiple tabs. Test the buttons and sound. Use the browser's console.

## Preparing a performance
This step should be done after the necessary software is installed and configured properly, all `systemd` services
are running without errors and you've made some tests with a bunch of smartphone devices. The only thing that has to
be done is to make all `systemd` units start when the computer is turned on. Enable the services with the command
```bash
sudo systemctl enable systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server hss-supercollider
```

Uncomment line 13 of [`killHSS`](bin/killHSS.sh). This will enable the *conductor* to shutdown the computer by
double-clicking on the `shutdown` button.

To stop services from starting on computer boot, run
```bash
sudo systemctl disable systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server hss-supercollider
```

### After a performance
Disable `systemd` services
```bash
sudo systemctl disable systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server hss-supercollider
```
Remove the relevant service files from `/usr/lib/systemd/system/`
```bash
cd /usr/lib/systemd/system/
# We don't delete systemd-networkd
sudo rm hostapd@wlan0.service dhcpd4@wlan0.service hss-*
```
and the `10-wlan0.network` file from `/usr/lib/systemd/network/`
```bash
sudo rm /usr/systemd/network/10-wlan0.network
```

Change directory to `humanSoundSculpture` and checkout the branch `performace@venus`
```bash
cd ~/humanSoundSculpture
git checkout performance@venus
```

Commit any changes and checkout `master`
```bash
git commit -a -m "Performance end"
git checkout master
```

Now delete the branch `performance@venus`
```bash
git branch -D performance@venus
```

Assist performers to

- delete the *Human Sound Sculpture* app,
- delete the root certificate from their device trust store,
- delete the bookmark of *Human Sound Sculpture* in their browser.
