export HSS_IP = 192.168.100.1
export HSS_HTTP_PORT = 3000

export HSS_DIR := $(CURDIR)

# The three leftmost bytes of the IP (assuming an IPv4 24 bit netmask).
export HSS_NETWORK := $(shell expr $(HSS_IP) : '\(\([0-9]\{1,3\}\.\)\{3\}\)')

export SCLANG_PATH := $(shell which sclang)
export NODE_PATH := $(shell which node)
export DHCP_PATH := $(shell which dhcpd)
export HOSTAPD_PATH := $(shell which hostapd)

define copyAndReplaceVars =
envsubst < $(1) > ./$(2);
endef

define mkdirAndCopyReplaceVars =
mkdir $(1); \
dirPath=$(1); \
for file in $(CURDIR)/src/$(1)/*; do \
 $(call copyAndReplaceVars,$$file,$$dirPath/$$(basename $$file)) \
done
endef

.PHONY: all

all : webserver systemd conf public

webserver : ./src/webserver/*.js
	$(call mkdirAndCopyReplaceVars,webserver)

systemd : ./src/systemd/*
	$(call mkdirAndCopyReplaceVars,systemd)

conf : ./src/conf/*
	$(call mkdirAndCopyReplaceVars,conf)

public : ./src/public/*
	mkdir public; \
	for file in ./src/public/*; do \
	  name=$$(basename $$file); \
	  if [[ -d $$file ]]; then \
	    $(call mkdirAndCopyReplaceVars,public/$$name); \
	  else \
	    $(call copyAndReplaceVars,$$file,public/$$name) \
	  fi; \
	done

.PHONY: clean
clean :
	rm -r webserver systemd conf public
