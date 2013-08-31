//deps
var d3 = require('d3')
var copyHash = require('hashish').copy
var enableSVGPan = require('./lib/SVGPan.js')

// constants
var pi = Math.PI;

// tools
function isObject(obj) { return typeof obj === 'object' }

// the vizualization container and viewport
var vis = d3.select('body').append('svg').attr('id','vizContainer')
                           .append('g').attr('id','viewport')

enableSVGPan(document.getElementById('vizContainer'))

var RecArc = window.RecArc = module.exports = {

  drawHash: function(params) {
    this.drawChildren({
      depth: 0,
      x: params.x,
      y: params.y,
      target: params.target,
      radius: 250,
      startAngle: 0,
      label: 'obj',
    })
  },

  drawChildren: function(params) {(function(){
    var self = this,
        index = 0,
        childKeys = isObject(params.target) ? Object.keys(params.target) : [],
        sproutCount = childKeys.length+1, //+1 to give space for root
        outerDomainRadius = params.radius,
        coreDomainRadius = params.radius/3,
        // zeta = Math.sin(2*pi/sproutCount),
        maxChildRadius = (outerDomainRadius-coreDomainRadius)/2,
        //childRadius = params.radius/3,
        // childRadius = (2*zeta*coreDomainRadius)/(2*(1-zeta)),
        childRadius = maxChildRadius

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
      self.drawLabel({
        x: params.x,
        y: params.y,
        text: params.label,
        size: childRadius/5,
      })
      
      // Draw Stem
      var stem = {
        innerPoint: {
          x: params.x+coreDomainRadius*Math.sin(startAngle),
          y: params.y+coreDomainRadius*-Math.cos(startAngle),
        },
        outerPoint: {
          x: params.x+(coreDomainRadius+childRadius/1.5)*Math.sin(startAngle),
          y: params.y+(coreDomainRadius+childRadius/1.5)*-Math.cos(startAngle),
        },
      }
      self.drawLine({
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

        newParams.target = child
        newParams.x = childOrigin.x
        newParams.y = childOrigin.y
        newParams.radius = childRadius
        newParams.startAngle = startAngle-pi
        newParams.label = childKey
        if (!isObject(child)) newParams.label += ': '+child
        // draw child
        var childSvg = self.drawChildren( newParams )
      }
      index++;
    }
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
      innerRadius: params.radius*0.95,
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

};
