# ####################################################################################################
#	Human Sound Sculpture
# ####################################################################################################
VPATH = src/conf:src/systemd:src/web

# userHome should be the value of user's $HOME.
# It is used in the target 'install' to copy
# the web server user service file to ~/.config/systemd/user.
# Since this target is build with superuser privileges,
# $HOME will be /. Hence, defining
#	userHome := $(shell echo $$HOME) WON'T WORK
userHome := /home/pi

export HSS_IP := 192.168.10.2
export HSS_HTTP_PORT := 3000
export WIFI_NAME := pi
export WIFI_COUNTRYCODE := GR

# Find the name of the wifi interface
# with the shell command
#     ip link show
# Normaly, the name should start with a 'w'.
export WIFI_INTERFACE := $(shell ip link show | grep -o -e '\<w[[:alnum:]]\+')

# The mac address of the wifi interface, can
# be found with the shell command
#     ip link show WIFI_INTERFACE
# where WIFI_INTERFACE is the value of the
# above variable. The output of 'ip link'
# will print the MAC address on the second line.
# It is a series of hexadecimal bytes
# separated by colons just after `link/ether`.
export WIFI_MACADDRESS := $(shell ip addr show | grep -A 10 -e '\<w[[:alnum:]]' | grep -o '\<link/ether \([[:alnum:]]\{2\}:\)\{5\}[[:alnum:]]\{2\}' | cut -d ' ' -f 2)

export HSS_DIR := $(CURDIR)

# The three leftmost bytes of the IP (assuming an IPv4 24 bit netmask).
export HSS_NETWORK := $(shell expr $(HSS_IP) : '\(\([0-9]\{1,3\}\.\)\{3\}\)')

export NODE_PATH := $(shell which node)
export DHCP_PATH := $(shell which dhcpd)
export HOSTAPD_PATH := $(shell which hostapd)

define replaceVars =
envsubst < $< > $@
endef

.PHONY : all

all : webserver/origin.mjs webclient/javascript/origin.mjs systemd/10-$(WIFI_INTERFACE).network \
	systemd/dhcpd4@.service systemd/hostapd@.service systemd/hss-web-server.service \
	conf/dhcpd.conf conf/hostapd-$(WIFI_INTERFACE).conf

webserver/origin.mjs webclient/javascript/origin.mjs : origin-src.mjs
	@$(replaceVars)

systemd/10-$(WIFI_INTERFACE).network : 10-wifi-src.network systemd
	@$(replaceVars)

systemd/dhcpd4@.service : dhcpd4@-src.service systemd
	@$(replaceVars)

systemd/hostapd@.service : hostapd@-src.service systemd
	@$(replaceVars)

systemd/hss-web-server.service : hss-web-server-src.service systemd
	@$(replaceVars)

conf/dhcpd.conf : dhcpd-src.conf conf
	@$(replaceVars)

conf/hostapd-$(WIFI_INTERFACE).conf : hostapd-src.conf conf
	@$(replaceVars)

.PHONY: createCertificates

createCertificates : certs
	openssl req -newkey rsa:2048 -nodes -keyout $</hss-key.pem -x509 -days 365 -out $</hss-crt.pem

conf systemd certs :
	@mkdir $@

.PHONY : install uninstall clean cleanCertificates

install :
	@systemServiceDir=/lib/systemd/system/; \
	cp -i systemd/10-$(WIFI_INTERFACE).network /lib/systemd/network/; \
	cp -i systemd/dhcpd4@.service systemd/hostapd@.service systemd/hss-web-server.service $$systemServiceDir; \
	cp -i conf/dhcpd.conf /etc/dhcp/; \
	cp -i conf/hostapd-$(WIFI_INTERFACE).conf /etc/hostapd/

uninstall :
	@systemServiceDir=/lib/systemd/system; \
	rm -i /lib/systemd/network/10-$(WIFI_INTERFACE).network $$systemServiceDir/dhcpd4@.service \
	$$systemServiceDir/hostapd@.service $$systemServiceDir/hss-web-server.service /etc/dhcp/dhcpd.conf \
	/etc/hostapd/hostapd-$(WIFI_INTERFACE).conf
clean :
	@rm -r webserver/origin.mjs systemd conf webclient/javascript/origin.mjs

cleanCertificates :
	@rm -ir certs/
