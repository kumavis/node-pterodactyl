// require pterodactyl
var pterodactyl = require('./index.js')

// deps
var esprima = require('esprima')

// parse javascript into syntax tree
var src = "var x = 1 + 2"
var obj = esprima.parse(src)

// var obj = [
//   [obj,obj,obj,obj,obj,obj],
//   [obj,obj,obj,obj,obj,obj],
//   [obj,obj,obj,obj,obj,obj],
//   [obj,obj,obj,obj,obj,obj],
// ]

// draw syntax tree
var hashGraph = pterodactyl.drawHash({
  target: obj,
  x: 500,
  y: 500,
})

window.z = []
hashGraph.nodeMap.forEach(function(value,key,mapReference){
  if (key) {
    var x = value.x, y = value.y
    if ( x && y ) {
      debugger
      window.z.push({x:x,y:y})
      console.log('key',key,'x',x,'y',y)
    }
  }
})

// pterodactyl.viewportControl.
// Object.keys(nodeGraph)