
npx icon-set-creator create icon-and-splash.png

npx react-native generate-bootsplash icon-and-splash.png \
  --platforms=android,ios,web \
  --background=F5FCFF \
  --logo-width=90 \
  --assets-output=assets \
  --flavor=main \
  --html=index.html