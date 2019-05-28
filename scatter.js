var margin = { top: 50,
        right: 100,
        bottom: 50,
        left: 70 },
    outerWidth = 1800,
    outerHeight = 900,
    width = outerWidth - margin.left ,
    height = outerHeight - margin.top - margin.bottom,
    width2 = width + 200;

var x = d3.scale.linear().range([0, width]).nice();

var y = d3.scale.linear().range([height, 0]).nice();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width);

var Brand = "Brand",
    Model = "Model",
    Fuel = "Fuel",
    Gearbox = "Gear box",
    Averageconsumption = "Average consumption",
    CO2emissions = "CO2 emissions",
    Engine = "Engine",
    Category = "Category",
    Fiscalpower = "Fiscal power",
    Power = "Power",
    Numberofdoors = "Number of doors",
    Index = 'Index',
    Price = "Price";



d3.csv("vectors.csv", function(data) {
    console.log("length is:",data.length)
    data.forEach(function(d) {
        // d["URL"]= +d["URL"];
        // d["Brand"] = +d["Brand"];
        // d["Fuel"] = +d["Fuel"];
        // d["Gear box"] = +d["Gear box"];
        // d["Average consumption"] = +d["Average consumption"];
        // d["CO2 emissions"] = +d["CO2 emissions"];
        d["Engine"] = +d["Engine"];
        // d["Category"] = +d["Category"];
        d["Fiscal power"] = +d["Fiscal power"];
        d["Number of doors"] = +d["Number of doors"];
        d["Price"] = +d["Price"];
        d["Power"] = +d["Power"];
        d["Index"] = +d["Index"];

    });

    var xMax = d3.max(data, function(d) { return d.XX; }) * 1.2,
        xMin = d3.min(data, function(d) { return d.XX; }),
        xMin = xMin > 0 ? 0 : xMin,
        yMax = d3.max(data, function(d) { return d.YY; }) * 1.2,
        yMin = d3.min(data, function(d) { return d.YY; }),
        yMin = yMin > 0 ? 0 : yMin;



    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);



    var color = d3.scale.category10();

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
            return Brand + ": " + d.Brand  + "<br>" + Model + ": " + d["Model"] + "<br>"
                + Fuel + ": " + d["Fuel"] + "<br>" + Gearbox + ": " + d["Gear box"] +
                "<br>" + Averageconsumption + ": " + d["Average consumption"] + " l / 100km"
                + "<br>" + CO2emissions + ": " + d["CO2 emissions"] + " g / km" + "<br>" + Engine + ": " + d["Engine"]
                + "<br>" + Power + ": " + d["Power"] + " ch"
                + "<br>" + Category + ": " + d["Category"] + "<br>" + Fiscalpower + ": " + d["Fiscal power"]
                + "<br>" + Numberofdoors + ": " + d["Number of doors"] + "<br>" + Price + ": " + d["Price"] + " " + "€" + "TTC/mois*";
        });



    var zoomBeh = d3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([0,1000])
        .on("zoom", zoom);


    // by default: d3.select("#scatter")
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);


    svg.call(tip);

    svg.append("rect")
        .classed("cluster",true)
        .attr("width", width)
        .attr("height", height);


    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .classed("label", true)
        .attr("x", width)
        .attr("y", margin.bottom - 10)
        .style("text-anchor", "end");
        // .text("x axis")

    svg.append("g")
        .classed("y axis", true)
        .call(yAxis)
        .append("text")
        .classed("label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left-10)
        .attr("dy", ".71em");
        // .text("y axis")

    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);




    objects.selectAll(".dot")
        .data(data)
        .enter()
        .append("svg:image")
        // .attr("id",function (d) { return data.indexOf(d);})
        .classed("dot", true)
        .attr("x", function (d) { return x(d.XX); } )
        .attr("y", function (d) { return y(d.YY); } )
        .attr("width",30)
        .attr("height",30)
        .attr("xlink:href", function (d) { return ("./pictures/"+d["Index"]+".jpg");})
        // .attr("xlink:href", function (d) { return ("./pictures/"+data.indexOf(d).toString()+".jpg");})
        .on("mouseover.text", tip.show)
        .on("mouseover.cycle",function (d) {d3.select(this).transition()
            .duration(500).attr("width",300).attr("height",300);})
        .on("mouseout", tip.hide)
        .on("mouseout.cycle",function (d) {d3.select(this).transition()
            .duration(500).attr("width",30).attr("height",30);})
        .on("click",function (d) {
            window.open(d.URL, target="_blank");
        })





    function zoom() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);

        svg.selectAll(".dot").attr({
            x: function(d) {
                return x(d.XX);
            },
            y: function(d) {
                return y(d.YY);
            }
        })



    }

    function transform(d) {
        return "translate(" + x(d.XX) + "," + y(d.YY) + ")";
    }
});
