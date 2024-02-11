rm app/release.keystore

keytool -genkey -v -keystore android/app/release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
