# Preparation
Performers of *Human Sound Sculpture* use a smartphone device to connect to a local WIFI TLS network.
With the browser they direct to the website of the piece. Recent versions of the most well-known
browsers should work. In general, the website should work on every browser that supports
the `WebSocket` protocol and the `Web Audio API`.

Performers direct to the website by typing the `IP` address and the `HTTP` port inside the address bar.
So, if the `IP` is `$HSS_IP` and the port is `$HSS_HTTP_PORT`, they should type `https://$HSS_IP:$HSS_HTTP_PORT`.
Performers should be informed that the browser will show a warning of the form
```
Your connection is not private
```
To avoid this they can install the TLS certificate to their device trust store. This can be done by
directing the browser to `https://$HSS_IP:$HSS_HTTP_PORT/rootCA.pem`. In some cases the device will ask
the user if he wants to install the certificate. In other cases, the user should download the file
and add it manualy by going to device settings.

Some performers might hesitate to deal with security issues on their device. Especially, the installation
of the TLS certificate could result in persistent warnings such as `Network may be monitored`. These performers can
avoid to install the certificate.

The website is developed as a PWA. Performers, if they wish, can download the website to their device.
This is for the benefit of those who don't want to type the address. Alternatively, they can
bookmark the page.

A `TEST` button appears on the *conductor* and *player* pages. This could be utilized to balance the volume
across smartphone devices. Parameters regarding the note sequence can be set in the file
[humanSoundSculpture.scd](humanSoundSculpture.scd). The variable `hss` holds an `Event` object. This `Event`
is defined in [hssEvent.scd](supercollider/hssEvent.scd). It offers the keys `ampMul`, `durMul` and `deltaMul`.
These are multipliers for the amplitude, duration and successive note time interval values produced by the
algorithmic process. If used, should be set with respect to the ambient soundscape of the performance place,
the number of the performers and the distance between successive performers. For example, to multiply all the default
durations by a factor of two, one would add the next line at the end of [humanSoundSculpture.scd](humanSoundSculpture.scd)
```supercollider
hss.durMul = 2.0;
```

Special care should be taken on the extended intervals of immobility of the performers. To mitigate immobility
issues a performance may integrate slight movements. Any deviations from the text score shall be made on the
following basis:

- The perfornance should emanate a "frozen" atmosphere.
- The performance is a snapshot of a process that unfolds in time. The movement of people along a line.
- A spectator may attend the event from seconds, to minutes to the whole performance. She may be present from the beginning,
	or come moments before the end.
- The ambient soundscape is part of the piece. Could be used in contrast with the stillness of the performers, metaphorically,
	aesthetically etc.
- The performance is realized in *public space*. It should permit to ignore it.
