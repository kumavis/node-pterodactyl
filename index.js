//deps
var d3 = require('d3')

// constants
var vis = d3.select("body").append("svg"),
    pi = Math.PI;

var RecArc = window.RecArc = module.exports = {

  start: function() {
      this.draw()
  },

  draw: function() {
    var index = 0,
        circles = 50
    while (index < circles) {
      this.drawSprout({
        x: 200*(index%6)+100,
        y: 200*Math.floor(index/6)+100,
        seperations: 1+index,
      })
      index++;
    }
  },

  drawSprout: function(params) {
    var self = this,
        segments = params.seperations
        index = 0,
        circleRadius = 60,
        stemLength = 25
    while (index < segments) {
      var startAngle = index*(360/segments)*(pi/180),
          endAngle = (index+1-0.1)*(360/segments)*(pi/180),
          innerRadius = circleRadius,
          outerRadius = innerRadius+5

      self.drawArc({
        x: params.x,
        y: params.y,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        startAngle: startAngle,
        endAngle: endAngle,
      })
      self.drawLine({
        x1: params.x+innerRadius*Math.sin(startAngle),
        y1: params.y+innerRadius*-Math.cos(startAngle),
        x2: params.x+(innerRadius+stemLength)*Math.sin(startAngle),
        y2: params.y+(innerRadius+stemLength)*-Math.cos(startAngle),
      })
      index++;
    }
  },

  drawLine: function(params) {
    // var line = d3.svg.arc()
    vis.append("svg:line")
      .attr("x1", params.x1)
      .attr("y1", params.y1)
      .attr("x2", params.x2)
      .attr("y2", params.y2)
      .style("stroke", "rgb(6,120,155)")
      .style("stroke-width", 2);
  },

  drawArc: function(params) {
    var arc = d3.svg.arc()
      .innerRadius(params.innerRadius)
      .outerRadius(params.outerRadius)
      .startAngle(params.startAngle) //in radians
      .endAngle(params.endAngle)     //in radians
    vis.append("path")
      .attr("d", arc)
      .attr("transform", "translate("+params.x+","+params.y+")")
    return arc
  },

};

RecArc.start()
