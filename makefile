export HSS_IP = 192.168.100.1
export HSS_HTTP_PORT = 3000
export WIFI_INTERFACE = wlan0
export WIFI_MACADDRESS = b8:27:eb:1e:2c:8d
export WIFI_NAME = pi
export WIFI_COUNTRYCODE = GR

export HSS_DIR := $(CURDIR)

# The three leftmost bytes of the IP (assuming an IPv4 24 bit netmask).
export HSS_NETWORK := $(shell expr $(HSS_IP) : '\(\([0-9]\{1,3\}\.\)\{3\}\)')

export SCLANG_PATH := $(shell which sclang)
export NODE_PATH := $(shell which node)
export DHCP_PATH := $(shell which dhcpd)
export HOSTAPD_PATH := $(shell which hostapd)

# ##################################################
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
if [[ $(1) != $(2) ]]; then \
  mv $(1) $(2); \
fi
endef

.PHONY: all

all : systemd/10-$(WIFI_INTERFACE).network conf/hostapd-$(WIFI_INTERFACE).conf webserver public

systemd/10-$(WIFI_INTERFACE).network : systemd
	@$(call renameIfNotEqual,$(wildcard $</10*.network),$@)

conf/hostapd-$(WIFI_INTERFACE).conf : conf
	@$(call renameIfNotEqual,$(wildcard $</hostapd-*.conf),$@)

webserver : $(CURDIR)/src/webserver/*.js
	@$(call mkdirAndCopySetVars,webserver)

systemd : $(CURDIR)/src/systemd/*
	@$(call mkdirAndCopySetVars,systemd)

conf : $(CURDIR)/src/conf/*
	@$(call mkdirAndCopySetVars,conf)

public : $(CURDIR)/src/public/*
	@mkdir public; \
	for file in $(CURDIR)/src/public/*; do \
	  name=$$(basename $$file); \
	  if [[ -d $$file ]]; then \
	    $(call mkdirAndCopySetVars,public/$$name); \
	  else \
	    $(call copyAndSetVars,$$file,public) \
	  fi; \
	done

.PHONY: install
install : webserver systemd conf public
	systemdPath=$(CURDIR)/systemd; \
	systemServiceDir=/lib/systemd/system/; \
	cp -i $$systemdPath/10-$(WIFI_INTERFACE).network /lib/systemd/network/; \
	cp -i $$systemdPath/dhcpd4@.service $$systemServiceDir; \
	cp -i $$systemdPath/hostapd@.service $$systemServiceDir; \
	cp -i $$systemdPath/hss-web-server.service $$systemServiceDir; \
	cp -i $$systemdPath/hss-supercollider.service $$systemServiceDir

.PHONY: clean
clean :
	rm -r webserver systemd conf public
