var Map = require('es6-map-shim').Map;
window.treeify = require('treeify').asTree

//deps
var d3 = require('d3')
var copyHash = require('hashish').copy
var enableSVGPan = require('./lib/SVGPan.js')

// constants
var pi = Math.PI;

// tools
function isObject(obj) { return typeof obj === 'object' }

// the vizualization container and viewport
var vis = d3.select('body')
  .append('svg').attr('id','vizContainer').attr("width", window.innerWidth).attr("height", window.innerHeight)
  .append('g').attr('id','viewport')

var viewportControl = enableSVGPan(document.getElementById('vizContainer'))


var Pterodactyl = module.exports = {

  viewportControl: viewportControl,

  drawHash: function(params) {
    var map = new Map();
    var nodeGraph = this.drawChildren({
      nodeMap: map,
      x: params.x,
      y: params.y,
      target: params.target,
      radius: 250,
      startAngle: 0,
      label: 'obj',
    })
    return nodeGraph
  },

  drawChildren: function(params) {return (function(){
    var self = this,
        index = 0,
        childKeys = isObject(params.target) ? Object.keys(params.target) : [],
        sproutCount = childKeys.length+1, //+1 to give space for root
        offspringSizeRatio = 1/5,
        outerDomainRadius = params.radius,
        coreDomainRadius = outerDomainRadius*offspringSizeRatio,
        // zeta = Math.sin(2*pi/sproutCount),
        maxChildRadius = (outerDomainRadius-coreDomainRadius)/2,
        //childRadius = params.radius/3,
        // childRadius = (2*zeta*coreDomainRadius)/(2*(1-zeta)),
        childRadius = maxChildRadius

    params._children = []

    while (index < childKeys.length+1) {
      var startAngle = index*(360/sproutCount)*(pi/180)+params.startAngle,
          endAngle = (index+1-0.1)*(360/sproutCount)*(pi/180)+params.startAngle

      // Draw Core
      self.drawArc({
        x: params.x,
        y: params.y,
        innerRadius: coreDomainRadius,
        outerRadius: coreDomainRadius*1.1,
        startAngle: startAngle,
        endAngle: endAngle,
      })

      var childOrigin = {
        x: params.x+(coreDomainRadius+childRadius)*Math.sin(startAngle),
        y: params.y+(coreDomainRadius+childRadius)*-Math.cos(startAngle),
      }

      // Draw Label
      var labelParams = {
        x: params.x,
        y: params.y,
        text: params.label,
        size: childRadius/5,
      }
      var label = self.drawLabel(labelParams)
      // add node to nodeMap
      var mapTarget = typeof params.target === 'object' ? params.target : {_: params.target}
      params.nodeMap.set(mapTarget,labelParams)

      // Draw Stem
      var stem = {
        innerPoint: {
          x: params.x+coreDomainRadius*Math.sin(startAngle),
          y: params.y+coreDomainRadius*-Math.cos(startAngle),
        },
        outerPoint: {
          x: params.x+(coreDomainRadius+childRadius-childRadius*offspringSizeRatio)*Math.sin(startAngle),
          y: params.y+(coreDomainRadius+childRadius-childRadius*offspringSizeRatio)*-Math.cos(startAngle),
        },
      }
      if (index!=0) self.drawLine({
        width: coreDomainRadius/50,
        x1: stem.innerPoint.x,
        y1: stem.innerPoint.y,
        x2: stem.outerPoint.x,
        y2: stem.outerPoint.y,
      })

      // // DEBUGGERY - domains
      // // draw core domain
      // self.drawCircle({
      //   radius: coreDomainRadius,
      //   x: params.x,
      //   y: params.y,
      // }).style('fill', 'rgb(6,120,155)')
      // // draw outer domain
      // self.drawCircle({
      //   radius: outerDomainRadius,
      //   x: params.x,
      //   y: params.y,
      // }).style('fill', 'rgb(6,120,155)')

      if (index!=0) {
        // modify params for child
        var newParams = copyHash(params),
            childKey = childKeys[index-1],
            child = params.target[childKey]

        delete newParams._children

        newParams.target = child
        newParams.x = childOrigin.x
        newParams.y = childOrigin.y
        newParams.radius = childRadius
        newParams.startAngle = startAngle-pi
        newParams.label = childKey
        newParams.nodeMap = params.nodeMap
        if (!isObject(child)) newParams.label += ': '+child

        // draw child (recursive)
        var childSvg = self.drawChildren( newParams )
        params._children.push( childSvg )

      }
      index++;
    }
    return params
  }).bind(this)()},

  drawLabel: function(params) {
    var label = vis.append('svg:text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('x', params.x)
      .attr('y', params.y)
      .attr('font-size', params.size)
      .text(params.text)
    return label
  },

  drawLine: function(params) {
    // var line = d3.svg.arc()
    var path = vis.append('svg:line')
      .attr('x1', params.x1)
      .attr('y1', params.y1)
      .attr('x2', params.x2)
      .attr('y2', params.y2)
      .style('stroke', 'rgb(6,120,155)')
      .style('stroke-width', params.width);
    return path
  },

  drawCircle: function(params) {
    return this.drawArc({
      innerRadius: params.radius*0.99,
      outerRadius: params.radius,
      startAngle: 0,
      endAngle: 2*pi,
      x: params.x,
      y: params.y,
    })
  },

  drawArc: function(params) {
    var arc = d3.svg.arc()
      .innerRadius(params.innerRadius)
      .outerRadius(params.outerRadius)
      .startAngle(params.startAngle) //in radians
      .endAngle(params.endAngle)     //in radians
    var path = vis.append('path')
      .attr('d', arc)
      .attr('transform', 'translate('+params.x+','+params.y+')')
    return path
  },

  getContainer: function() {
    return document.getElementById('vizContainer')
  },

};
