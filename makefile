export HSS_IP = 192.168.100.1
export HSS_HTTP_PORT = 3000

export HSS_DIR := $(CURDIR)

# The three leftmost bytes of the IP (assuming an IPv4 24 bit netmask).
export HSS_NETWORK := $(shell expr $(HSS_IP) : '\(\([0-9]\{1,3\}\.\)\{3\}\)')

export SCLANG_PATH := $(shell which sclang)
export NODE_PATH := $(shell which node)
export DHCP_PATH := $(shell which dhcpd)
export HOSTAPD_PATH := $(shell which hostapd)

variables = HSS_IP HSS_HTTP_PORT HSS_DIR \
	SC_PATH NODE_PATH DHCP_PATH HOSTAPD_PATH

values = $(foreach var, $(variables), $(value $(var)))

webserver : ./src/webserver/*.js
	mkdir webserver
	for file in ./src/webserver/*; do \
	  name=$$(basename $$file); \
	  envsubst < $$file > ./webserver/$$name; \
	done

systemd : ./src/systemd/*
	mkdir systemd
	for file in ./src/systemd/*; do \
	  name=$$(basename $$file); \
	  envsubst < $$file > ./systemd/$$name; \
	done

conf : ./src/conf/*
	mkdir conf
	for file in ./src/conf/*; do \
	  name=$$(basename $$file); \
	  envsubst < $$file > ./conf/$$name; \
	done

public : ./src/public/*
	mkdir public
	for file in ./src/public/*; do \
	  name=$$(basename $$file); \
	  if [[ -d $$file ]]; then \
	    mkdir ./public/$$name; \
	    for subfile in $$file/*; do \
	      subname=$$(basename $$subfile); \
	      envsubst < $$subfile > public/$$name/$$subname; \
	    done; \
	  else \
	    envsubst < $$file > ./public/$$name; \
	  fi; \
	done

.PHONY: paths
paths :
	echo $(CURDIR);

.PHONY: test
test :
	for file in ./src/webserver/*; do \
	  name=$$(basename $$file); \
	  envsubst < $$file > ./webserver/$$name
	  echo $$name; \
	done
