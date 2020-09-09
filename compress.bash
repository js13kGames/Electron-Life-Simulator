cd dist
7z -mx=7 a DIST.zip index.html main.js | grep size

# https://javascript-minifier.com/curl
curl -X POST -s --data-urlencode 'input@main.js' https://javascript-minifier.com/raw > main.remin.js
7z -mx=7 a DIST.remin.zip index.html main.remin.js | grep size



