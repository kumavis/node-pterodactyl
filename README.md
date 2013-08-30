node-pterodactyl
================
![node-pterodactyl][logo]

Fractal stack-over-time Visualizer

### wut

By leveraging fractal geometry, it can display an arbitrary amount of information in a finite amount of space.

### API Proposal

takes in data in this format,
representing a stack across time / stack history.

Flaw: This contains a lot of repeated data.

```javascript
var pterodactyl = require('pterodactyl')

var stackHistory = [
  [a0],
  [a0,b0],
  [a0,b1],
  [a0,b1,c0],
  [a0,b2],
  [a0,b2,c0],
  [a0,b2,c1],
  [a1],
  [a2],
]

pterodactyl.draw(stackHistory)
```

[logo]: https://github.com/kumavis/node-pterodactyl/raw/master/www/logo.png "node-pterodactyl logo"