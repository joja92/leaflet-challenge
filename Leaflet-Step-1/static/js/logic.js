// map wrapper
var myMap = L.map("map", {
    center: [
        0, 0
    ],
    zoom: 3,
});

// pull map visual
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 15,
        id: "mapbox.streets",
        accessToken: API_KEY
    }).addTo(myMap);

// source for earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// adjust size of bubbles
function markerSize(magnitude) {
    return magnitude * 30000;
}

// change color of bubbles depending on magnitude
function markerColor(magnitude) {
    if (magnitude < 1) {
        return "green";
    } else if ((magnitude >= 1) && (magnitude < 2)) {
        return "yellowgreen";
    } else if ((magnitude >= 2) && (magnitude < 3)) {
        return "yellow";
    } else if ((magnitude >= 3) && (magnitude < 4)) {
        return "orange";
    } else if ((magnitude >= 4) && (magnitude < 5)) {
        return "red";
    }else {
        return "maroon";
    }
}
// use D3 to build interactive map
d3.json(queryUrl, function(response) {
    console.log(response);

    var quakeArray = [];
    var placeArray = [];

    // extract desired information for each earthquake
    for (var i = 0; i < response.features.length; i++) {
        var thisQuake = response.features[i];

        if (thisQuake) {
            quakeArray.push([thisQuake.geometry.coordinates[1], thisQuake.geometry.coordinates[0], thisQuake.properties.mag]);
            placeArray.push(thisQuake.properties.place);
        }
    }

    // generate bubbles
    for (var i = 0; i < quakeArray.length; i++) {
        L.circle(quakeArray[i], {
            fillOpacity: 0.6,
            color: "black",
            fillColor: markerColor(quakeArray[i][2]),
            radius: markerSize(quakeArray[i][2])
        }).bindPopup("<h1>" + placeArray[i] + "</h1> <hr> <h3>Coordinates: " + quakeArray[i][0] + ", " + quakeArray[i][1] + "</h3> <hr> <h3>Magnitude: " + quakeArray[i][2] + "</h3>").addTo(myMap);
    }

    // create legend
    var legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var mags = ["<1", "1-2", "2-3", "3-4", "4-5", ">5"];
        var colors = ["green", "yellowgreen", "yellow", "orange", "red", "maroon"];
        var labels = [];

        var legendInfo = "<h1>Magnitude</h1>";

        div.innerHTML = legendInfo;

        mags.forEach(function(mag, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\">" + mags[index] + "</li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(myMap);
});