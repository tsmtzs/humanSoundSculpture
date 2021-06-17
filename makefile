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

binariesExist := $(and $(SCLANG_PATH),$(NODE_PATH),$(DHCP_PATH),$(HOSTAPD_PATH))

ifndef $(binariesExist)
$(warning WARNING: No binaries found for at least one of node, sclang, dhcp, hostapd)
endif

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

.PHONY: all

all : webserver conf public systemd \
	systemd/10-$(WIFI_INTERFASE).network conf/hostapd-$(WIFI_INTERFACE).conf

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

# CAUTION: Assume only one file in the recipes
systemd/10-$(WIFI_INTERFACE).network : systemd/10-*.network
	 @mv $(wildcard systemd/*.network) $@

conf/hostapd-$(WIFI_INTERFACE).conf : conf/hostapd-*.conf
	mv $(wildcard conf/hostapd-*.conf) $@

.PHONY: clean
clean :
	rm -r webserver systemd conf public
