
if [[ ! -z $1 ]]; then
    if [ $1 == 'debug' ]; then
        if [ ! -e android/app/src/main/assets ]; then
            mkdir -p android/app/src/main/assets
        fi

        npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

        cd android/

        ./gradlew assembleDebug

        cd ..
    elif [ $1 == 'release' ]; then
        if [ ! -e android/app/src/main/assets ]; then
            mkdir -p android/app/src/main/assets
        fi

        npx react-native bundle --platform android --dev false --entry-file index.js \
            --bundle-output android/app/src/main/assets/index.android.bundle \
            --assets-dest android/app/src/main/res \
            --reset-cache --minify true

        cd android/

        ./gradlew assembleRelease

        cd ..
    fi
fi



if [[ ! -z $2 ]]; then
    if [ $2 == 'r' ]; then
        if [ $1 == 'debug' ]; then
            adb install -r android/app/build/outputs/apk/debug/app-debug.apk
        elif [ $1 == 'release' ]; then
            adb install -r android/app/build/outputs/apk/release/app-release.apk
        fi
    fi
fi