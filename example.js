// require pterodactyl
var ptero = require('./index.js')

// deps
var esprima = require('esprima')

var src = "var x = 1 + 2"

var obj = esprima.parse(src)
// var obj = {
//   a: 1,
//   b: {
//     d: 3,
//     e: 4,
//   },
//   c: 2
// }

ptero.drawHash({
  target: obj,
  x: 500,
  y: 500,
})

// ptero.sample()