import * as d3 from 'd3';


function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {

    const key = obj[property];
    if (!acc[key]) {
        acc[key] = [];
    }
    // Add object to list for given key's value
    acc[key].push(obj);
    return acc;
    }, {});
}

function assignClusters(clusters, b, first_row){
    var c = {};
    Object.entries(clusters).forEach(
        ([key, value]) => {
            // console.log(key, value);
            for(var i=0; i<value.length; i++)
            {
                if (!c[key]) {
                    c[key] = [];
                }
                if(b[value[i]['idx']]!==undefined)
                    c[key].push(b[value[i]['idx']]);

            }
        }
    );
    console.log(c);
    var tables="";
    Object.entries(c).forEach(
        ([key, value]) => {
            tables+="<table border='1|1' style='margin:50px;' bgcolor="+key+">";
            tables+="<tr>";
            for(var i=0; i<first_row.length; i++)
            {
            tables+="<th>"+first_row[i]+"</th>";
            }
            tables+="</tr>";
            // console.log(key, value);
            for(var i=0; i<value.length; i++)
            {
                tables+="<tr>";
                for(var j=0; j<value[i].length; j++)
                {
                    tables+="<td>"+value[i][j]+"</td>";
                }
                tables+="</tr>";
            }
            tables+="</table>";
        }
    );
    document.getElementById("box").innerHTML = tables;


}

function normalize(b, q, c){
    var maxele = new Array(c).fill(-1);
    for(var i=0; i<b.length; i++)
    {
        for(var j=0; j<q.length; j++)
        {
            if(parseInt(b[i][q[j]])>maxele[j]){
                maxele[j] = parseInt(b[i][q[j]]);
            }
        }

    }
    // q = shuffleArray(q);
    var w = Math.floor(c/2);
    console.log(w);
    var xarray = [];
    var yarray = [];
    var sum=0;
    for(var i=0; i<b.length; i++)
    {
        for(var j=0; j<w; j++)
        { 
            if(b[i][q[j]]!=="0")
            {
            sum+=parseInt(b[i][q[j]])/maxele[j];
            }
        }
        xarray.push(sum);
        sum = 0;

        for(var t=w; t<(c-1); t++)
        {
            if(b[i][q[t]]!=="0")
            {
            sum+=parseInt(b[i][q[t]])/maxele[t];
            }
        }
        yarray.push(sum);
        sum = 0;
    }
    
    

    var maxx = Math.max( ...xarray ), maxy = Math.max( ...yarray );
    console.log(maxx, maxy);
    for(var i=0; i<b.length; i++)
    {
        xarray[i] = xarray[i]/maxx;
        yarray[i] = yarray[i]/maxy;
    }
    // console.log(xarray);
    // console.log(yarray);

    return [xarray, yarray];
}




export function Upload() {
    var xarray = [], yarray = [];
    var fileUpload = document.getElementById("fileUpload");
    var noclusters = document.getElementById("noclusters").value;
    var noiter = document.getElementById("noiter").value;
    noclusters = parseInt(noclusters);
    noiter = parseInt(noiter);
    console.log(noclusters, noiter);
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
        
            var reader = new FileReader();
            reader.onload = function (e) {
            
                console.log(reader.result);

                alert(reader.result);
                var b = [];
                var a = reader.result.split('\n');
                a.forEach(element => {
                    b.push(element.split(','));
                });
                var first_row = b.shift();
                b.pop();
                console.log(b);
                var q=[];
                var c=0;

                for(var i=0; i<b[0].length; i++)
                {

                    if(!isNaN(b[0][i]))
                    {
                        c+=1;
                        q.push(i);
                    }

                }
                console.log(c, q);
                
                [xarray, yarray] = normalize(b,q,c);
                console.log(xarray, yarray);
                kMeans("#kmeans", 700, 700, noclusters, noiter, xarray, yarray, function(x){
                    assignClusters(x, b, first_row);
                });
            //  document.getElementsByTagName("svg").style.border = "thin dotted red";
                // console.log(reader.result.split('\n'));
                // console.log(reader.result);
                // console.log(clusters);
                // const newClusters = assignClusters(clusters, b);


            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
    return (xarray, yarray);
}





function kMeans(elt, w, h, numClusters, maxIter, xarray, yarray, callback) {


    // the current iteration
    var iter = 1,
        centroids = [],
        points = [];
        
    var margin = {top: 30, right: 20, bottom: 20, left: 30},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    var colors = d3.scale.category20().range();
    
    var svg = d3.select(elt).append("svg")
        .style("width", width + margin.left + margin.right)
        .style("height", height + margin.top + margin.bottom);
        // .style("margin", "-200px 0 100px")
        
    var group = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("g")
        .append("text")
        .attr("class", "label")
        .attr("transform", "translate(" + (width - margin.left - margin.right) + 
            "," + (height + margin.top + margin.bottom) + ")")
        .text("");

    /**
     * Computes the euclidian distance between two points.
     */
    function getEuclidianDistance(a, b) {
        var dx = b.x - a.x,
            dy = b.y - a.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    
    /**
     * Returns a point with the specified type and fill color and with random 
     * x,y-coordinates.
     */
    function getRandomPoint(type, fill) {

        return { 
            x: Math.round(Math.random() * width), 
            y: Math.round(Math.random() * height),
            type: type,
            fill: fill 
        };
    }

    /** 
     * Generates a specified number of random points of the specified type.
     */
    function initializePoints(num, type) {
        var result = [];
        for (var i = 0; i < num; i++) {
            var color = colors[i];
            if (type !== "centroid") {
                color = "#ccc";
            }
            var point = getRandomPoint(type, color);
            point.id = point.type + "-" + i;
            result.push(point);
        }
        console.log(type);
        console.log(result);
        return result;
    }

    function getPoints(type) {
        var result = [];
        for(var i=0; i<xarray.length; i++)
        {
            var color = "#ccc";
            var point = { 
                x: Math.round(xarray[i] * width), 
                y: Math.round(yarray[i] * height),
                type: type,
                fill: color,
                idx: i 
            };
            point.id = point.type + "-" + i;
            result.push(point);
            // const xrandom = array[Math.floor(Math.random() * array.length)];
        }
        console.log(result);
        return result;
    }


    function getCentroids(num, type) {
        var result = [];
        for(var i=0; i<num; i++)
        {
            var color = colors[i];
            var point = { 
                x: Math.round(xarray[Math.floor(Math.random() * xarray.length)] * width), 
                y: Math.round(yarray[Math.floor(Math.random() * yarray.length)] * height),
                type: type,
                fill: color 
            };
            point.id = point.type + "-" + i;
            result.push(point);
            // const xrandom = array[Math.floor(Math.random() * array.length)];
        }
        console.log(result);
        return result;
    }

    /**
     * Find the centroid that is closest to the specified point.
     */
    function findClosestCentroid(point) {
        var closest = {i: -1, distance: width * 2};
        centroids.forEach(function(d, i) {
            var distance = getEuclidianDistance(d, point);
            // Only update when the centroid is closer
            if (distance < closest.distance) {
                closest.i = i;
                closest.distance = distance;
            }
        });
        return (centroids[closest.i]); 
    }
    
    /**
     * All points assume the color of the closest centroid.
     */
    function colorizePoints() {
        points.forEach(function(d) {
            var closest = findClosestCentroid(d);
            d.fill = closest.fill;
        });
    }

    /**
     * Computes the center of the cluster by taking the mean of the x and y 
     * coordinates.
     */
    function computeClusterCenter(cluster) {
        return [
            d3.mean(cluster, function(d) { return d.x; }), 
            d3.mean(cluster, function(d) { return d.y; })
        ];
    }
    
    /**
     * Moves the centroids to the center of their cluster.
     */
    function moveCentroids() {
        centroids.forEach(function(d) {
            // Get clusters based on their fill color
            var cluster = points.filter(function(e) {
                return e.fill === d.fill;
            });
            // Compute the cluster centers
            var center = computeClusterCenter(cluster);
            // Move the centroid
            d.x = center[0];
            d.y = center[1];
        });
    }

    /**
     * Updates the chart.
     */
    function update() {
    
        var data = points.concat(centroids);
        
        // The data join
        var circle = group.selectAll("circle")
            .data(data);
            
        // Create new elements as needed
        circle.enter().append("circle")
            .attr("id", function(d) { return d.id; })
            .attr("class", function(d) { return d.type; })
            .attr("r", 5);
            
        // Update old elements as needed
        circle.transition().delay(100).duration(1000)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) { return d.fill; });
        
        // Remove old nodes
        circle.exit().remove();
        // console.log("herreeeeeeeeeeeeeeee");
        // console.log(data.groupBy);

        const grouped = groupBy(data, 'fill');
        // console.log(grouped);
        return grouped;
    }

    /**
     * Updates the text in the label.
     */
    function setText(text) {
        svg.selectAll(".label").text(text);
    }
    
    /**
     * Executes one iteration of the algorithm:
     * - Fill the points with the color of the closest centroid (this makes it 
     *   part of its cluster)
     * - Move the centroids to the center of their cluster.
     */
    function iterate() {
        
        // Update label
        setText("Iteration " + iter + " of " + maxIter);

        // Colorize the points
        colorizePoints();
        
        // Move the centroids
        moveCentroids();
        
        // Update the chart
        var grouped = update();
        return grouped;
    }

    /** 
     * The main function initializes the algorithm and calls an iteration every 
     * two seconds.
     */
    function initialize() {
        var grouped = {};
        // Initialize random points and centroids
        centroids = getCentroids(numClusters, "centroid");
        points = getPoints("point");
        
        // initial drawing
        grouped = update();
        
        var interval = setInterval(function() {
            if(iter < maxIter + 1) {
                grouped = iterate();
                iter++;
            } else {
                clearInterval(interval);
                setText("Done");
                callback(grouped);
                
            }
        }, 2 * 1000);
        

    }

    
    initialize();
}