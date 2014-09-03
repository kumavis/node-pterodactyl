var pterodactyl = require('./index.js')
var esprima = require('esprima')

// parse javascript into syntax tree
var src = "var x = 1 + 2"
var obj = esprima.parse(src)

// draw syntax tree
var hashGraph = pterodactyl.drawHash({
  target: obj,
  x: 500,
  y: 200,
})

// fix scroll
document.body.style.overflow = "hidden"