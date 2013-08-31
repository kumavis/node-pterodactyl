node-pterodactyl
================
![node-pterodactyl][logo]

Fractal tree Visualizer

### wut?

Display an arbitrary javascript object.
By leveraging fractal geometry and vector graphics,
pterodactyl can display vast amounts of information in a finite amount of space.

![screen shot][ss0]

### try it out

```bash
git clone git@github.com:kumavis/node-pterodactyl.git
cd node-pterodactyl
npm install
npm start
```

### examples

```javascript
var pterodactyl = require('pterodactyl')

var obj = {
  a: 1,
  b: {
    d: 3,
    e: 4,
  },
  c: 2,
}

pterodactyl.drawHash({
  target: obj,
  x: 500,
  y: 500,
})
```
![screen shot][ss2]


```javascript
var pterodactyl = require('pterodactyl')
var esprima = require('esprima')

var src = "var x = 1 + 2"
var obj = esprima.parse(src)

pterodactyl.drawHash({
  target: obj,
  x: 500,
  y: 500,
})
```
![screen shot][ss1]



[logo]: https://github.com/kumavis/node-pterodactyl/raw/master/www/logo.png "node-pterodactyl logo"
[ss0]: https://github.com/kumavis/node-pterodactyl/raw/master/www/ScreenShot0.png "node-pterodactyl screenshot"
[ss1]: https://github.com/kumavis/node-pterodactyl/raw/master/www/ScreenShot1.png "node-pterodactyl screenshot"
[ss2]: https://github.com/kumavis/node-pterodactyl/raw/master/www/ScreenShot2.png "node-pterodactyl screenshot"
