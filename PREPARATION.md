# Preparation
Performers of *Human Sound Sculpture* use a smartphone device to connect to a local wifi TLS network. With the browser they direct to the website of the piece. Recent versions of the most well-known
and used browsers should work. In general, the website should work on every browser that supports
the `WebSocket` protocol and the `Web Audio API`.

Performers direct to the website by typing the `IP` address and the `HTTP` port inside the address bar.
So, if the `IP` is `192.168.100.1` and the port is `3000`, they should write `https://192.168.100.1:3000`.
Performers should be informed that the browser will show a warning of the form
```
Your connection is not private
```
To avoid this they can install the TLS certificate to their device trust store. This can be done by
directing the browser to `https://192.168.100.1:3000/rootCA.pem`. In some cases the device will ask
the user if he wants to install the certificate. In other cases, the user should download the file
and add it manualy by going to device settings.

Some performers might hesitate to deal with security issues on their device. Especially, the installation
of the TLS certificate could result in warnings such as `Network may be monitored`. In such cases it is
better to avoid the installation.

The website is developed as a PWA. Performers, if they wish, can download the website to their device as
an app. This is for the benefit of those that don't want to type the address. Alternatively, they can
bookmark the page.
