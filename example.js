// require pterodactyl
var pterodactyl = require('./index.js')

// deps
var esprima = require('esprima')

// parse javascript into syntax tree
var src = "var x = 1 + 2"
var obj = esprima.parse(src)

var obj = [[obj,obj,obj,obj,obj,obj],[obj,obj,obj,obj,obj,obj],[obj,obj,obj,obj,obj,obj],[obj,obj,obj,obj,obj,6]]

// draw syntax tree
var nodeGraph = pterodactyl.drawHash({
  target: obj,
  x: 500,
  y: 500,
})

// pterodactyl.viewportControl.
// Object.keys(nodeGraph)