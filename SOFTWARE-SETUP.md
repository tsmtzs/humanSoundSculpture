# Software setup
**Table of Contents**

- [Install the required software](#install-the-required-software)
- [Clone the `humanSoundSculpture` repository](#clone-the-humansoundsculpture-repository)
- [Install `node.js` packages](#install-node.js-packages)
- [Work on a separate `git branch`](#work-on-a-separate-git-branch)
- [Configuration](#configuration)
- [Putting it all together](#putting-it-all-together)
- [Troubleshooting](#troubleshooting)
- [Preparing a performance](#preparing-a-performance)
- [After a performance](#after-a-performance)

## Install the required software
*Human Sound Sculpture* depends on a local WIFI TLS network. Performers connect with their smartphone and visit the website of the piece. A dedicated computer assigns IP addresses to clients, runs the web server and generates note events. All software configuration should be done on that computer. We have used the `Raspberry Pi model B+` single board computer with the `Raspberry Pi OS Lite` operating system. The following sections offer the details for setting up the piece. All commands assume the `Raspberry Pi OS`. They should work on every `Debian` based `Linux` distribution.

1. `Linux` (`Raspbian 10 buster`)

   `Raspberry Pi OS` is a `Debian` based operating system. Before installing any new software, might be a good idea to update and upgrade your system.

   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```

2. [`hostapd`](https://w1.fi/hostapd/) (version `2.8-devel`)

	This program is used to turn the WIFI network interface card of the computer into an access point. Install it with

	```bash
	sudo apt-get install hostapd
	```

3. [`dhcpd`](https://www.isc.org/dhcp/) (version `4.4.1`)

	This the ISC DHCP server. It is used to assign IP addresses to web clients. Install it with

	```bash
	sudo apt-get install isc-dhcp-server
	```

4. [`node.js`](https://nodejs.org/) (version `16.18.0`)

	`node.js` is a `JavaScript` runtime environment. The web server for *Human Sound Sculpture* is
	developed on it. Install `node.js` with

	```bash
	sudo apt-get install nodejs
	```

6. [`openssl`](https://www.openssl.org/) (version `1.1.1n`)

	The website of the piece is served on a local TLS network. You can create a TLS certificate with the program `openssl`. Install it with the command

	```bash
	sudo apt-get install openssl
	```

## Clone the `humanSoundSculpture` repository
This step assumes that you have installed all the necessary software. Open a `bash` terminal and change directory to an appropriate location.

```bash
# Change to user's home directory
cd
```

Clone the repository `humanSoundSculpture`.

```bash
git clone https://github.com/tsmtzs/humanSoundSculpture.git
```

## Install `node.js` packages
First, change directory to `humanSoundSculpture`

```bash
cd humanSoundSculpture
```

This project uses the packages [`express`](https://expressjs.com/) (version `4.18.2`), [`minimist`](https://github.com/minimistjs/minimist) and [`ws`](https://github.com/websockets/ws) (version `8.10.0`). Install the required packages with

```bash
npm install
```

## Work on a separate `git branch`
For a performance you should create a new branch on top of `master`. First, checkout `master`.

```bash
git checkout master
```

Now, create and checkout the new branch. Use an appropriate name. Something like `test` or `test@raspberry` or `performance@venus` might be handy.

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
- `NODE_PATH`: Absolute path to the `node.js` executable.
- `DHCP_PATH`: Absolute path to the `DHCP` server executable.
- `HOSTAPD_PATH`: Absolute path to the `hostapd` executable.
- `userHome`: Absolute path to user's home directory. This variable is used only
	in [makefile](makefile).

Files that depend on the uppercase named variables are saved under `src`. Variable names are prepended by a `$` sign or are written inside `${`, `}`, like `$HSS_DIR` or `${HSS_DIR}`. To find all the occurrences of a variable use `grep`, e.x. `grep -rn 'HSS_IP' src/`.

[`GNU make`](https://www.gnu.org/software/make/) is used to set the values of those variables, create directories and copy the files under `src` to the appropriate locations. `Make` reads the file [`makefile`](makefile). In this file, the variables `HSS_DIR`, `HSS_NETWORK`, `WIFI_INTERFACE`, `WIFI_MACADDRESS`, `HSS_NETWORK`, `NODE_PATH`, `DHCP_PATH` and `HOSTAPD_PATH` are set programmatically. All other variables must be set manually. To do so, edit [`makefile`](makefile).

First, we set the variable `userHome` in line 12. In lines 14 - 17 we set the IP and `HTTP` port, as well as the name and the country code of the local WIFI network. For this guide will set IP to `192.168.100.1` and port number to `443`.

After setting all variables, lines 12 to 17 of [`makefile`](makefile) may look like this:

```make
userHome := /home/pi

export HSS_IP := 192.168.100.1
export HSS_HTTP_PORT := 443
export WIFI_NAME := pi
export WIFI_COUNTRYCODE := GR
```

The next step is to run

```bash
make
```

and

```bash
make createCertificates
```

The first command will use the files under `src` and the environment variables to generate configuration, `systemd` unit and `JavaScript` files. Furthermore, will create the necessary directories under `humanSoundSculpture` and save those files to the right place. The target `createCertificates` will create the TLS certificates for the network.

We can delete these files and directories, with

```bash
make clean
```

and

```bash
make cleanCertificates
```

Now we have to copy the `systemd` service and configuration files to the right locations. The `make` target `install` will do all these things for us. Run it with superuser privileges:

```bash
sudo make install
```

The above command will prompt us if a file with the same name is found to a destination directory. By typing `y` or `n` we can choose to overwrite it, respectively, or not. Specifically, the ISC DHCP server accepts a configuration file with name `dhcpd.conf` under `/etc/dhcp`. If this file already exists, might be a good idea to rename it before `make install`.

We can delete all the copied files from the `install` target, with

```bash
sudo make uninstall
```

## Add user to `/etc/sudoers`
The performer with label `conductor` can shutdown the computer by pressing a button on the `conductor` webpage. In order for this to work, the linux user ID should added to `sudoers`. The command

```bash
sudo visudo
```

will open an editor with the file `/etc/sudoers` loaded. If user ID is `pi`, append at the end of this file the line

```
pi ALL=NOPASSWD: /usr/bin/systemctl poweroff,/usr/bin/systemctl reboot
```

## Putting it all together
In this and the subsequent sections we will assume that the environment variables of the piece are assigned the values from the previous section. First reload the `systemd` configuration

```bash
# Reload system services
sudo systemctl daemon-reload
```

Then start the `systemd` unit `systemd-networkd` to assign a static IP to the WIFI interface device.

```bash
sudo systemctl start systemd-networkd.service
```

Use the unit `hostapd@.service` to turn the network card into an access point. The unit `dhcpd4@.service` will start the DHCP server. Start both services by passing the WIFI interface device name. If this is `wlan0`, then we can type.

```bash
sudo systemctl start hostapd@wlan0.service
sudo systemctl start dhcpd4@wlan0.service
```

Check if the wireless interface is assigned the IP, with

```bash
ip addr show wlan0
```

Now, start the web server process with the unit `hss-web-server.service`

```bash
sudo systemctl start hss-web-server.service
```

By using the browser, navigate to `https://192.168.100.1:443` (*Note*: For port `443`, clients can just type `https://192.168.100.1`). Hopefully, you will see the *index* page of *Human Sound Sculpture*.

A *system* `systemd` service is stopped with the command

```bash
sudo systemctl stop <unit-name>
```

## Troubleshooting
You can check the status of a `systemd` service with

```bash
sudo systemctl status <unit-name>
```

E.x. the output of `sudo systemctl status systemd-networkd` will print `Active: active (running)` if the process `systemd-networkd` is running, `Active: inactive (dead)` if the process is not running etc.

If things go wrong, use `journalctl` to query `systemd` logs. Inspecting the output of`sudo journalctl -xe` or `sudo journalctl -u <unit-name> -r` might reveal usefull information about the unit `<unit-name>`.

You can see runtime messages for a service, with the command

```bash
sudo journalctl -u <unit-name> -f
```

This approach was found usefull in inspecting `node.js` messages. Use it in combination with log statements inside web server files.

Sometimes an error may occur in a `systemd` unit file and not in the underlying process, and vice versa. If a service is *active* but the underlying process doesn't seem to work, you could utilize the `ps` *shell* program to check if the process is running. For example, suppose that the service `hostapd@wlan0` is active but the computer does not act as an access point. The command

```bash
ps -e | grep hostapd
```

will output the PID of the process if `hostapd` is running. Otherwise, the output will be empty.

With `systemd-networkd`, `dhcpd4@wlan0`, `hostapd@wlan0` running, you can start the web server process by calling `node server.js` (or `sudo node server.js` if the global variable `HSS_HTTP_PORT` is less than 1024). After any changes in `systemd` service files, you should reload the configuration of the service manager with

```bash
sudo systemctl daemon-reload
```

We find it usefull to use `ssh` to connect to the *Human Sound Sculpture* computer from another machine. Use the browser to navigate to piece's website. Open multiple tabs. Test the buttons and sound. Use the browser's console.

## Preparing a performance
This step should be done after the necessary software is installed and configured properly, all `systemd` services are running without errors and you've made some tests with a bunch of smartphone devices. The only thing that we need to do is to make all `systemd` units start when the computer is turned on. Enable the services with the command

```bash
# Enable the system services
sudo systemctl enable systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server
```

To stop `systemd` services from starting on computer boot, run

```bash
sudo systemctl disable systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server
```

## After a performance
Disable `systemd` services

```bash
# Disable system services
sudo systemctl disable systemd-networkd hostapd@wlan0 dhcpd4@wlan0 hss-web-server
```

Call

```bash
sudo make uninstall
```

to remove all the relevant service and network files.

To delete all directories created with `make` run

```bash
make clean
```

and

```bash
make cleanCertificates
```

Checkout the branch `master` and delete the branch of the performance
```bash
git stash
git checkout master
git branch -D performance@venus
git stash clear
```
