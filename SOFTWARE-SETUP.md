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
- [Preparing a performance](#preparing-a-performance)

## Installing and configuring software
*Human Sound Sculpture* depends on a local WIFI TLS network. Performers
connect with their smartphones and visit the website of the piece. A
dedicated computer assigns IP addresses to clients, runs the web server and
generates note events. All software configuration should be
done on this computer. We have used the `Raspberry Pi model B+` single board
computer with the `Raspberry Pi OS Lite` operating system. The following sections
offer the details for setting up the piece.
All commands assume the `Raspberry Pi OS`. They should work on every `Debian` based
`Linux` distribution.

### Install the required software
1. `Linux` (`Raspbian 10 buster`)

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

4. [`hostapd`](https://w1.fi/hostapd/) (version `2.8-devel`)

	This program is used to turn the WIFI network interface card of the computer into
	an access point. Install it with

	```bash
	sudo apt-get install hostapd
	```

5. [`dhcpd`](https://www.isc.org/dhcp/) (version `4.4.1`)

	This the ISC DHCP server. It is used to assign IP addresses to web clients. Install it with

	```bash
	sudo apt-get install isc-dhcp-server
	```

6. [`node.js`](https://nodejs.org/) (version `10.21.0`)

	`node.js` is a `JavaScript` runtime environment. The web server for *Human Sound Sculpture* is
	developed on it. Install `node.js` with

	```bash
	sudo apt-get install nodejs
	```

7. [`SuperCollider`](https://supercollider.github.io/) (version `3.10.0`)

	`SuperCollider` is an audio programming language. Follow this
	[raspberry-installation](https://github.com/supercollider/supercollider/blob/develop/README_RASPBERRY_PI.md)
	guide to install it on `Raspberry Pi`. *Human Sound Sculpture* utilizes only the `sclang`
	`SuperCollider` language program.

	The `SimpleNumber` method `betarand` is used to calculate some probabilities. It is an extension of the class
	found in `sc3-plugins`.  Install the plugins by following the [sc3plugin-installation](https://supercollider.github.io/sc3-plugins/) guide.
	Alternatively, you could download only the file
	[ProbabilityDistributions.sc](https://github.com/supercollider/sc3-plugins/blob/dd092a20cb66fc976d47ad402be601985cb8bf84/source/LoopBufUGens/sc/classes/LJP%20Classes/ProbabilityDistributions.sc)
	inside the `SuperCollider` user extension directory. This is, usually, `~/.local/share/SuperCollider/Extensions`. You can find it by calling
	`Platform.userExtensionDir` from within the `SuperCollider` interpreter.

	The class `PGraphWalk` is a extension of the language. It can be found in the github repository [sc-tsmtzs](https://github.com/tsmtzs/sc-tsmtzs).
	Clone the repository inside the `SuperCollider` user extension directory.

8. [`mkcert`](https://github.com/FiloSottile/mkcert) (version `1.4.3`)

	The website of the piece is served on a local TLS network. You can create a TLS certificate
	with the program `mkcert`. To install it follow the directions found in [mkcert-installation](https://github.com/FiloSottile/mkcert#installation).

	Another way, although not recommended (read *use at your own risk*), to install `mkcert` is to download the binaries:

	1. Find the `CPU` architecture
	```bash
	dpkg --print-architecture
	```
	This will, probably, print `armhf` on `Raspberry Pi 3`.

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

9. [`git`](https://git-scm.com/) (version `2.20.1`)

	A new `git branch` is created for every performance or test of *Human Sound Sculpture*. Install `git` by running

	```bash
	sudo apt-get install git
	```

10. (*optional*) [`XeTeX`](https://tug.org/xetex/)

	`XeTeX` is a `TeX` derivative. It is used to produce the `PWA` [icon](public/icons/hssIcon_192x192.png)
	of the piece. If you would like to modify this picture, you can install it with

	```bash
	sudo apt-get install texlive
	```
11. (*optional*) [`tikz`](https://github.com/pgf-tikz/pgf)

	This is a `TeX` package for creating graphics. It is part of the `texlive` distribution.
12. (*optional*) [`ffmpeg`](https://ffmpeg.org/) (version `4.3.1`)

	`ffmpeg` is a program for handling multimedia files. It is used in the `bash` script
	[`multiresize`](bin/multiresize.sh) to resize a given picture file. Will be usefull if
	you want to modify the `PWA` icon of the piece. Install it with

	```bash
	sudo apt-get install ffmpeg
	```

### Clone the `humanSoundSculpture` repository
This step assumes that you have installed all the necessary software. Open a `bash` terminal and change
directory to an appropriate location.

```bash
## Change to user's home directory
cd
```

Clone the repository `humanSoundSculpture`.

```bash
git clone https://github.com/tsmtzs/humanSoundSculpture.git
```

### Install `node` packages
First, change directory to `humanSoundSculpture`
```bash
cd humanSoundSculpture
```

This project uses the packages [`express`](https://expressjs.com/) (version `4.17.1`),
[`node-osc`](https://github.com/MylesBorins/node-osc) (version `4.1.1`) and
[`ws`](https://github.com/websockets/ws) (version `3.3.3`). Install the required packages with

```bash
npm install
```

### Work on a separate `git branch`
For a performance you should create a new branch on top of `master`. First, checkout `master`.
```bash
git checkout master
```
Now, create the new branch. Use an appropriate name.
Something like `test` or `test@raspberry` or `performance@venus` might be handy.

```bash
git checkout -b performance@venus
```

## Configuration
The runtime environment of the piece depends on the following variables:

- `HSS_DIR`: An absolute path. Points to the `humanSoundSculpture` directory.
- `HSS_IP`: An IPv4 address. Web server's IP on the local network.
- `HSS_NETWORK`: The network prefix of the local WIFI network, i.e. the three
		leftmost bytes of the IP (assuming an IPv4 24 bit netmask).
- `HSS_HTTP_PORT`: A positive integer. The `HTTP` port number.
- `WIFI_INTERFACE`: The _name_ of the WIFI interface.
- `WIFI_MACADDRESS`: The MAC address of the WIFI interface.
- `WIFI_NAME`: The name of the local WIFI network.
- `WIFI_COUNTRYCODE`: Country code.
- `SCLANG_PATH`: Absolute path to `SuperCollider`'s `sclang` binary file.
- `NODE_PATH`: Absolute path to the `node.js` executable.
- `DHCP_PATH`: Absolute path to the `DHCP` server executable.
- `HOSTAPD_PATH`: Absolute path to the `hostapd` executable.
- `userHome`: Absolute path to user's home directory. This variable is used only
	in [makefile](makefile).

Files that depend on the uppercase named variables are saved under `src`. Variable names are prepended by a `$`
sign or are written inside `${`, `}`, like `$HSS_DIR` or `${HSS_DIR}`. To find all the occurrences of a variable
use `grep`, e.x. `grep -rn 'HSS_IP' src/`.

[`GNU make`](https://www.gnu.org/software/make/) is used to set the values of those variables, create directories
and copy the files under `src` to the appropriate locations. `Make` reads the file [`makefile`](makefile). Inside
it, the variables `HSS_DIR`, `HSS_NETWORK`, `SCLANG_PATH`, `NODE_PATH`, `DHCP_PATH` and `HOSTAPD_PATH` are set
programmatically. All other variables must be set manually. To do so, edit [`makefile`](makefile).

First, we set the IP and `HTTP` port in lines 6, 7. We can set them to whatever values seem appropriate.
For this guide will set the IP to `192.168.100.1` and port number to `3000`.

Lines 13 and 23 define the variables `HSS_INTERFACE` and `HSS_MACADDRESS`, respectively. The first one is the name and the second 
the MAC address of the WIFI interface. To find them use the `ip` shell command:
```bash
ip link show
```
The output should print a numbered list of network interfaces. Normaly, the name of the WIFI interface
begins with a `w`. Assume that it is `wlan0`. The MAC address is a series of hexadecimal bytes
separated by colons. Can be found in the output of `ip link`. It is on the second line of the WIFI interface list item,
just on the right of `link/ether`. This should be something like `b8:27:eb:1e:2c:8d`.

After setting all variables, lines 6 to 34 of [`makefile`](makefile) may look like this:
```bash
export HSS_IP = 192.168.100.1
export HSS_HTTP_PORT = 3000

# Find the name of the wifi interface
# with the shell command
#     ip link show
# Normaly, the name should start with a 'w'.
export WIFI_INTERFACE = wlan0

# The mac address of the wifi interface, can
# be found with the shell command
#     ip link show WIFI_INTERFACE
# where WIFI_INTERFACE is the value of the
# above variable. The output of 'ip link'
# will print the MAC address on the second line.
# It is a series of hexadecimal bytes
# separated by colons just after `link/ether`.
export WIFI_MACADDRESS = b8:27:eb:1e:2c:8d

export WIFI_NAME = pi
export WIFI_COUNTRYCODE = GR

# userHome should be the value of user's $HOME.
# It is used in the target 'install' to copy
# the SuperCollider user service file to ~/.config/systemd/user.
# Since this target is build with superuser privileges,
# $HOME will be /. Hence, defining
#	userHome := $(shell echo $$HOME) WAN'T WORK
userHome := /home/pi
```

The next step is to run
```bash
make
```
This command will copy all the directories and files under `src` to `humanSoundSculpture`. Furthermore, will
replace all environment variables with their values, make the directory `certs` and create the TLS certificates.
We can delete the files created, with
```bash
make clean
```

Now we have to copy the `systemd` service files to the appropriate locations, install the TLS root certificate to
the system trust store and copy it to `public`. The `make` target `install` will do all these things for us. Run it
with superuser privileges:
```bash
sudo make install
```
The above command will prompt us if a file with the same name is found to the destination directory. By typing `y`
or `n` we can choose to overwrite it, respectively, or not. Specifically, the ISC DHCP server accepts a
configuration file with name `dhcpd.conf` under `/etc/dhcp`. If this file already exists, might be a good idea
to rename it before `make install`.

We can delete all the files from the `install` target, with
```bash
sudo make uninstall
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

where `<HSS_IP>` is `192.168.100.1` in our case. Now, install the root certificate with
```bash
mkcert -install
```

Web clients should, also, install the root certificate on their device. This is the `rootCA.pem` file
located under `mkcert -CAROOT`. Copy this file to `public/`.
```bash
# First, change directory to humanSoundSculpture
cd ..
# Then copy the root certificate
cp $(mkcert -CAROOT)/rootCA.pem public/
```
In most cases, clients should be able to install the certificate to their trust store by using the browser
to navigate to `https://192.168.100.1:3000/rootCA.pem` (in general to`https://HSS_IP:HSS_HTTP_PORT/rootCA.pem`).

### Configure the web server
We are going to use the TLS certificate `hss-crt.pem` and key `hss-key.pem`. They were generated with `mkcert` and
are located under `certs`. Open the file [`server.js`](webserver/server.js). Lines 18-19, should read these files.

[`Server.js`](webserver/server.js) listens to `WebSocket` messages from web clients. If the message is `shutdown` will
call the `bash` script [`killHSS`](bin/killHSS.sh). This message is signaled by the *conductor* of the performance
after double-clicking on the `shutdown` button. The idea here is to be able to shutdown the computer (a `Raspberry Pi` in
our case) without the need of a keyboard, a monitor or a person different than the performers.

In line 13 of [`killHSS`](bin/killHSS.sh) we read `shutdown now;`.
This line is commented by default. Uncomment it for a live performance.

The `systemd` unit `hss-web-server.service` starts the web server process of the piece. The `ExecStart` option
should have the correct path for the `node` executable. Make changes, if needed, and copy the file
[`hss-web-server.service`](systemd/hss-web-server.service) to `/lib/systemd/system/`.
```bash
sudo cp systemd/hss-web-server.service /lib/systemd/system/
```

## Putting it all together
First reload the `systemd` configuration
```bash
# Reload for system services
sudo systemctl daemon-reload

# Reload for user services
systemctl --user daemon-reload
```
Then start the `systemd` unit `systemd-networkd` to assign a static IP to the WIFI interface device.
```bash
sudo systemctl start systemd-networkd.service
```

Use the unit `hostapd@.service` to turn the network card into an access point. The unit `dhcpd4@.service`
will start the DHCP server. Start both services by passing the WIFI interface device name `wlan0`.
```bash
sudo systemctl start hostapd@wlan0.service
sudo systemctl start dhcpd4@wlan0.service
```

Check if the wireless interface is assigned the IP.
```bash
ip addr show wlan0
```

Now, start the web server process with the unit `hss-web-server.service` and `SuperCollider` with
`hss-supercollider.service`.
```bash
sudo systemctl start hss-web-server.service

# Unit hss-supercollider is a user service
systemctl --user start hss-supercollider.service
```

By using the browser, navigate to `https://192.168.100.1:3000`. Hopefully, you will see the *index*
page of *Human Sound Sculpture*.

A *system* `systemd` service is stopped with the command
```bash
sudo systemctl stop <unit-name>
```

Stop *user* services with
```bash
systemctl --user stop <unit-name>
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

You can see runtime messages about a service, with the command
```bash
sudo journalctl -u <unit-name> -f
```
This approach was found usefull in inspecting `node.js` or `SuperCollider` messages. Use it in
compination with log statements inside web server or `SuperCollider` files.

Sometimes an error may occur in a `systemd` unit file and not in the underlying process, and vice versa. With
`systemd-networkd`, `dhcpd4@wlan0`, `hostapd@wlan0` running, you can start the web server process by calling
`node server.js` (or `sudo node server.js` if the global variable `HSS_HTTP_PORT` is less than 1024).
After any change in the `systemd` *system* or *user* service files, you should reload the configuration
of the service manager with
```bash
# System services
sudo systemctl daemon-reload

# User services
systemctl --user daemon-reload
```

We find it usefull to use `ssh` to connect to the *Human Sound Sculpture* computer from another machine. Use the
browser to navigate to piece's website. Open multiple tabs. Test the buttons and sound. Use the browser's console.

## Preparing a performance
This step should be done after the necessary software is installed and configured properly, all `systemd` services
are running without errors and you've made some tests with a bunch of smartphone devices. The only thing that has to
be done is to make all `systemd` units start when the computer is turned on. Enable the services with the command
```bash
# Enable the system services
sudo systemctl enable systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server

# hss-supercollider is a user service
systemctl --user enable hss-supercollider
```

Uncomment line 13 of [`killHSS`](bin/killHSS.sh). This will enable the *conductor* to shutdown the computer by
double-clicking on the `shutdown` button.

To stop services from starting on computer boot, run
```bash
sudo systemctl disable systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server
systemctl --user disable hss-supercollider
```

### After a performance
Disable `systemd` services
```bash
# Disable system services
sudo systemctl disable systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server

# Disable the user service hss-supercollider
systemctl --user disable hss-supercollider
```
Remove the relevant service files under `/lib/systemd/system/` and `~/.config/systemd/user/`
```bash
cd /lib/systemd/system/
# We don't delete systemd-networkd
sudo rm hostapd@.service dhcpd4@.service hss-web-server.service

# Delete the hss-supercollider user service file
rm ~/.config/systemd/user/hss-supercollider.service
```

as well, as the `10-wlan0.network` file from `/lib/systemd/network/`
```bash
sudo rm /lib/systemd/network/10-wlan0.network
```

Delete the `dhcpd.conf` file inside `/etc/dhcp/`
```bash
sudo rm /etc/dhcp/dhcpd.conf
```

and rename the original `conf` file.

```bash
sudo mv /etc/dhcp/dhcp.conf.original /etc/dhcp/dhcp.conf
```

Delete `/etc/hostapd/hostapd-wlan0.conf`.

```bash
sudo rm /etc/hostapd/hostapd-wlan0.conf
```

Delete `mkcert` from within `/usr/bin/`.
```bash
sudo rm /usr/bin/mkcert
```

Change directory to `humanSoundSculpture` and checkout the branch `performace@venus`.
```bash
cd ~/humanSoundSculpture
git checkout performance@venus
```

Commit any changes and checkout `master`.
```bash
git commit -a -m "Performance end"
git checkout master
```

Now delete the branch `performance@venus`.
```bash
git branch -D performance@venus
```

Assist performers to

- delete the *Human Sound Sculpture* app,
- delete the root certificate from their device trust store,
- delete the bookmark of *Human Sound Sculpture* in their browser.
