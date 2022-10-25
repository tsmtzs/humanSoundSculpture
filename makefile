# ####################################################################################################
#	Human Sound Sculpture
# ####################################################################################################
SHELL = /bin/sh

export HSS_IP = 192.168.1.65
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

export HSS_DIR := $(CURDIR)

# The three leftmost bytes of the IP (assuming an IPv4 24 bit netmask).
export HSS_NETWORK := $(shell expr $(HSS_IP) : '\(\([0-9]\{1,3\}\.\)\{3\}\)')

export SCLANG_PATH := $(shell which sclang)
export NODE_PATH := $(shell which node)
export DHCP_PATH := $(shell which dhcpd)
export HOSTAPD_PATH := $(shell which hostapd)

# ####################################################################################################
define copyAndSetVars =
envsubst < $(1) > $(CURDIR)/$(2)/$$(basename $(1));
endef

define mkdirAndCopySetVars =
mkdir $(CURDIR)/$(1); \
dirName=$(1); \
for file in $(CURDIR)/src/$(1)/*; do \
 $(call copyAndSetVars,$$file,$$dirName) \
done
endef

define renameIfNotEqual =
if [ $(1) != $(2) ]; then \
  mv $(1) $(2); \
fi
endef

VPATH = src/conf:src/systemd

.PHONY: all

all : systemd/10-$(WIFI_INTERFACE).network conf/hostapd-$(WIFI_INTERFACE).conf \
	webserver public certs/hss-key.pem

webserver : $(CURDIR)/src/webserver/*.js
	@$(call mkdirAndCopySetVars,webserver)

public : $(CURDIR)/src/public/*
	@mkdir public; \
	for file in $(CURDIR)/src/public/*; do \
	  name=$$(basename $$file); \
	  if [ -d $$file ]; then \
	    $(call mkdirAndCopySetVars,public/$$name); \
	  else \
	    $(call copyAndSetVars,$$file,public) \
	  fi; \
	done


systemd/10-$(WIFI_INTERFACE).network : 10-wifi-src.network systemd
	envsubst < $< > $@

systemd/dhcpd4@.service : dhcpd4@-src.service systemd
	envsubst < $< > $@

systemd/hostapd@.service : hostapd@-src.service systemd
	envsubst < $< > $@

systemd/hss-web-server.service : hss-web-server-src.service systemd
	envsubst < $< > $@

conf/dhcpd.conf : dhcpd-src.conf conf
	envsubst < $< > $@

conf/hostapd-$(WIFI_INTERFACE).conf: hostapd-src.conf conf
	envsubst < $< > $@

conf systemd certs:
	@mkdir $@

certs/hss-key.pem certs/hss-crt.pem &: certs
	@mkcert -key-file $^/hss-key.pem -cert-file $^/hss-crt.pem localhost $(HSS_IP)

.PHONY: install installTLSCert uninstall clean

install : all installTLSCert
	@systemdPath=$(CURDIR)/systemd; \
	systemServiceDir=/lib/systemd/system/; \
	cp -i $$systemdPath/10-$(WIFI_INTERFACE).network /lib/systemd/network/; \
	cp -i $$systemdPath/dhcpd4@.service $$systemServiceDir; \
	cp -i $$systemdPath/hostapd@.service $$systemServiceDir; \
	cp -i $$systemdPath/hss-web-server.service $$systemServiceDir; \
	cp $(CURDIR)/conf/dhcpd.conf /etc/dhcp/; \
	cp -i --preserve=all $$systemdPath/hss-supercollider.service $(userHome)/.config/systemd/user/;

installTLSCert : certs/hss-key.pem certs/hss-crt.pem
	@mkcert -install; \
	cp $$(mkcert -CAROOT)/rootCA.pem public/

uninstall :
	@systemServiceDir=/lib/systemd/system; \
	rm -i /lib/systemd/network/10-$(WIFI_INTERFACE).network; \
	rm -i $$systemServiceDir/{dhcpd4@.service,hostapd@.service,hss-web-server}.service; \
	rm /etc/dhcp/dhcpd-hss.conf; \
	rm -r $(userHome)/.config/systemd/user/hss-supercollider.service

clean :
	rm -r webserver systemd conf public certs
