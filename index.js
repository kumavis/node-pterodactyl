//deps
var d3 = require('d3')
var copyHash = require('hashish').copy
var enableSVGPan = require('./SVGPan.js')

// constants
var vis = d3.select('body').append('svg').attr('id','vizContainer')
                           .append('g').attr('id','viewport'),
    pi = Math.PI;

enableSVGPan(document.getElementById('vizContainer'))

var RecArc = window.RecArc = module.exports = {

  start: function() {
      this.draw()
  },

  draw: function() {
    var index = 0,
        circles = 8,
        circlesPerRow = 4,
        complexityStep = 1,
        radius = 120,
        spacing = radius*3
    while (index < circles) {
      this.drawSprout({
        depth: 4,
        x: spacing*(index%circlesPerRow)+spacing/2,
        y: spacing*Math.floor(index/circlesPerRow)+spacing/1.5,
        segments: index*complexityStep,
        radius: radius,
        startAngle: 0,
      })
      index++;
    }
  },

  drawSprout: function(params) {
    var self = this,
        index = 0,
        segments = params.segments+1, //+1 to give space for root
        outerDomainRadius = params.radius,
        coreDomainRadius = params.radius/3,
        //childRadius = params.radius/3,
        zeta = Math.sin(2*pi/segments),
        childRadius = (2*zeta*coreDomainRadius)/(2*(1-zeta)),
        maxChildRadius = (outerDomainRadius-coreDomainRadius)/2

    // apply max to radius
    // if (childRadius>maxChildRadius) {
    //   console.log('squeeze radius: '+segments)
    //   childRadius = maxChildRadius 
    // }
    childRadius = maxChildRadius 

    // if (segments>6) {
    //   childRadius = (2*zeta*coreDomainRadius)/(2*(1-zeta))
    //   // var outerDomainRadius = (2*zeta*innerRadius)/(2*(1-zeta))
    //   console.log('depth: '+params.depth)
    //   console.log('segments: '+segments)
    //   console.log('zeta: '+zeta)
    //   console.log('outerDomainRadius: '+outerDomainRadius)
    // }

    while (index < segments) {
      var startAngle = index*(360/segments)*(pi/180)+params.startAngle,
          endAngle = (index+1-0.1)*(360/segments)*(pi/180)+params.startAngle

      // // Draw Core
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

      if (params.depth>0 && index!=0) {
        // modify params for child
        var newParams = copyHash(params)
        newParams.depth--
        newParams.x = childOrigin.x
        newParams.y = childOrigin.y
        newParams.radius = childRadius
        newParams.startAngle = startAngle-pi
        // draw child
        self.drawSprout( newParams )
      }
      index++;
    }
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

RecArc.start()
