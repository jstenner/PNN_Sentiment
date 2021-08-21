/**
 * D3 visualization for PNN broadcasts
 * Based on Mike Bostock's Zoomable Area:
 ^ http://bl.ocks.org/mbostock/4015254
 */

var margin = {
    top: 20,
    right: 60,
    bottom: 30,
    left: 20
},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// my data is coming in with 00:00:00 time at the end :-(
var parseDate = d3.time.format("%Y-%m-%d %X").parse,
    formatDate = d3.time.format("%Y");

var x = d3.time.scale().range([0, width]);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(-height, 0).tickPadding(6);

var yAxis = d3.svg.axis().scale(y).orient("right").tickSize(-width).tickPadding(6);

var area = d3.svg.area().interpolate("step-after").x(function(d) {
    return x(d.date);
}).y0(y(0)).y1(function(d) {
    return y(d.sentiment);
});

var line = d3.svg.line().interpolate("step-after").x(function(d) {
    return x(d.date);
}).y(function(d) {
    return y(d.sentiment);
});

var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var zoom = d3.behavior.zoom().on("zoom", draw);

d3.json("http://emeragency.electracy.org/pnn/broadcasts.json?network=CBS", function(error, data) {
    data.forEach(function(d) {
        // go through evely element and format it for use
        // in this case, convert it to a proper D3 date format
        d.date = parseDate(d.date);
        // in this case, make sure the string representation of the number is an actual number (+)
        d.sentiment = +d.sentiment;

    });

    //x.domain([new Date(2003, 0, 1), new Date(2014, 0, 0)]);
    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    y.domain([d3.min(data, function(d) {
        return d.sentiment;
    }), d3.max(data, function(d) {
        return d.sentiment;
    })]);
    zoom.x(x);

    svg.select("path.area").data([data]);
    svg.select("path.line").data([data]);
    //svg.select("path.circle").data([data]);

    var circles = circleGroup.selectAll("circle").data(data).enter().append("circle").attr("cx", function(d) {
        return x(d.date);
    }).attr("cy", function(d) {
        return y(d.sentiment);
    }).attr("r", 3).style("fill", "red");



    draw();

});






var gradient = svg.append("defs").append("linearGradient").attr("id", "gradient").attr("x2", "0%").attr("y2", "100%");

gradient.append("stop").attr("offset", "0%").attr("stop-color", "#fff").attr("stop-opacity", .5);

gradient.append("stop").attr("offset", "100%").attr("stop-color", "#999").attr("stop-opacity", 1);

svg.append("clipPath").attr("id", "clip").append("rect").attr("x", x(0)).attr("y", y(1)).attr("width", x(1) - x(0)).attr("height", y(0) - y(1));

svg.append("g").attr("class", "y axis").attr("transform", "translate(" + width + ",0)");

svg.append("path").attr("class", "area").attr("clip-path", "url(#clip)").style("fill", "url(#gradient)");

svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")");

svg.append("path").attr("class", "line").attr("clip-path", "url(#clip)");

svg.append("path").attr("class", "circle").attr("clip-path", "url(#clip)");

svg.append("rect").attr("class", "pane").attr("width", width).attr("height", height).call(zoom);

var circleGroup = svg.append("g").attr("class", "circles");




// This gets called one time. It's not a loop.


function draw() {
    svg.select("g.x.axis").call(xAxis);
    svg.select("g.y.axis").call(yAxis);
    svg.select("path.area").attr("d", area);
    svg.select("path.line").attr("d", line);
    //svg.select("g.circles").attr("d", circle);


}

// Draw these after the graph is loaded.
// Label for the X axis
svg.append("text").attr("x", width / 2).attr("y", height + margin.bottom).style("text-anchor", "middle").text("Broadcast Date");

// Label for Y axis
svg.append("text").attr("transform", "rotate(-90)").attr("y", width + margin.left + 10).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("Broadcast Sentiment Score");
