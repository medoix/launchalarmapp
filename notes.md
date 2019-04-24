# Convert .p12 Apple Certificate to cert.pem & key.pem
You can use following commands to extract public/private key from a PKCS#12 container:

Private key:
openssl pkcs12 -in yourP12File.pfx -nocerts -out privateKey.pem
Certificates:
openssl pkcs12 -in yourP12File.pfx -clcerts -nokeys -out publicCert.pem

# Crodova version for iOS (latest 4+ was breaking on build)
https://github.com/Telerik-Verified-Plugins/PushNotification/issues/71
ionic platform add ios@3.9.2


# Android Keystore
Key: launchalarm.jks
Pass: lebb02I!NnnsviJm63Vg!dYB
Alias: launchalarm
