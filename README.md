node-pterodactyl
================
![node-pterodactyl][logo]

Fractal tree Visualizer

### wut

Display an arbitrary javascript object.
By leveraging fractal geometry and vector graphics,
pterodactyl can display vast amounts of information in a finite amount of space.


### Examples

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

pterodactyl.drawHash(obj)
```

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

```
var pterodactyl = require('pterodactyl')
var esprima = require('esprima')

var src = "var x = 1 + 2"
var obj = esprima.parse(src)

ptero.drawHash({
  target: obj,
  x: 500,
  y: 500,
})
```



[logo]: https://github.com/kumavis/node-pterodactyl/raw/master/www/logo.png "node-pterodactyl logo"