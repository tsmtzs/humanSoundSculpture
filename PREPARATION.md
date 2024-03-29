# Preparation
Performers of *Human Sound Sculpture* use a smartphone device to connect to a local WIFI TLS network.
By using the browser they direct to the website of the piece. Recent versions of the most well-known
browsers should work. In general, the website should work on every browser that supports
the `WebSocket` protocol and the `Web Audio API`.

Performers direct to the website by typing the `IP` address and the `HTTP` port inside the address bar.
So, if the `IP` is `192.168.100.1` and the port is `3000`, they should type `https://192.168.100.1:3000`.
Performers should be informed that the browser will show the warning
```
Your connection is not private
```
To avoid this they can install the TLS certificate to their device trust store. This can be done by
directing the browser to `https://192.168.100.1:3000/rootCA.pem`. In some cases the device will ask
the user if he wants to install the certificate. In other cases, the user should download the file
and add it manualy.

Some performers might hesitate to deal with security issues on their device. Especially, the installation
of the TLS certificate could result in persistent warnings such as `Network may be monitored`. These performers can
avoid to install the certificate.

The website is developed as a PWA. Performers can, if they wish, download the website to their device.
If so, an icon will appear on the home screen. This is done for the benefit of those who don't want to
type the address. The TLS certificate should have been installed in order for the website to run as an app.
Alternatively, they can bookmark the page from within the browser.

A `TEST` button appears on the *conductor* and *player* pages. This could be utilized to balance the volume
across smartphone devices. Parameters regarding the note sequence can be set in the file
[`humanSoundSculpture.scd`](supercollider/humanSoundSculpture.scd). The variable `hss` holds a `SuperCollider` `Event` object. This `Event`
is defined in [`hssEvent.scd`](supercollider/hssEvent.scd). It offers the keys `ampMul`, `durMul` and `deltaMul`.
These are multipliers for the amplitude, duration and successive note time interval values produced by the
algorithmic process. If used, they should be set with respect to the ambient soundscape of the performance location,
the number of the performers and the distance between successive performers. For example, to multiply all the default
durations by a factor of two, one would add the next line at the end of [`humanSoundSculpture.scd`](supercollider/humanSoundSculpture.scd)
```supercollider
hss.durMul = 2.0;
```
Before any changes that have to do with the note sequence, it might help to make some tests by playing with the `SuperCollider` document
[`soundTests.scd`](supercollider/soundTests.scd).

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
