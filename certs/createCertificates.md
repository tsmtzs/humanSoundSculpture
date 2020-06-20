# Use mkcert
Download from: https://github.com/FiloSottile/mkcert

Inside directory certs run
```
mkcert -key-file hss-key.pem -cert-file hss-crt.pem -p12-file hss.p12 localhost ::1 HSS_IP media-art.xyz
```

Install root CA certificate with
```
mkcert -install
```

Copy `rootCA.pem` from `mkcert CAROOT` directory to `public`.

## On mobile devices
Direct to `https://HSS_IP:NODE_PORT/rootCA.pem` and install certificate.

## Uninstall the app

