var myMap = L.map("map", {
    center: [
        0, 0
    ],
    zoom: 3,
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 15,
        id: "mapbox.streets",
        accessToken: API_KEY
    }).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function markerSize(magnitude) {
    return magnitude * 30000;
}

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

d3.json(queryUrl, function(response) {
    console.log(response);

    var quakeArray = [];
    var placeArray = [];

    for (var i = 0; i < response.features.length; i++) {
        var thisQuake = response.features[i];

        if (thisQuake) {
            quakeArray.push([thisQuake.geometry.coordinates[1], thisQuake.geometry.coordinates[0], thisQuake.properties.mag]);
            placeArray.push(thisQuake.properties.place);
        }
    }

    for (var i = 0; i < quakeArray.length; i++) {
        L.circle(quakeArray[i], {
            fillOpacity: 0.6,
            color: "black",
            fillColor: markerColor(quakeArray[i][2]),
            radius: markerSize(quakeArray[i][2])
        }).bindPopup("<h1>" + placeArray[i] + "</h1> <hr> <h3>Coordinates: " + quakeArray[i][0] + ", " + quakeArray[i][1] + "</h3> <hr> <h3>Magnitude: " + quakeArray[i][2] + "</h3>").addTo(myMap);
    }

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


// sample data
// {"type":"FeatureCollection","metadata":{"generated":1572371294000,"url":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson","title":"USGS All Earthquakes, Past Week","status":200,"api":"1.8.1","count":2260},"features":[
//     {"type":"Feature","properties":{"mag":2.04,"place":"5km E of Pahala, Hawaii","time":1572370957350,"updated":1572371140320,"tz":-600,"url":"https://earthquake.usgs.gov/earthquakes/eventpage/hv71203686","detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/hv71203686.geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"automatic","tsunami":0,"sig":64,"net":"hv","code":"71203686","ids":",hv71203686,","sources":",hv,","types":",geoserve,origin,phase-data,","nst":38,"dmin":0.050849999999999999,"rms":0.11,"gap":143,"magType":"md","type":"earthquake","title":"M 2.0 - 5km E of Pahala, Hawaii"},"geometry":{"type":"Point","coordinates":[-155.43133539999999,19.197332400000001,35.57]},"id":"hv71203686"},
//     {"type":"Feature","properties":{"mag":2.1099999999999999,"place":"4km ESE of Pahala, Hawaii","time":1572370923870,"updated":1572371263070,"tz":-600,"url":"https://earthquake.usgs.gov/earthquakes/eventpage/hv71203681","detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/hv71203681.geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"automatic","tsunami":0,"sig":68,"net":"hv","code":"71203681","ids":",hv71203681,","sources":",hv,","types":",geoserve,origin,phase-data,","nst":43,"dmin":0.044339999999999997,"rms":0.12,"gap":149,"magType":"ml","type":"earthquake","title":"M 2.1 - 4km ESE of Pahala, Hawaii"},"geometry":{"type":"Point","coordinates":[-155.4358368,19.1923332,35.420000000000002]},"id":"hv71203681"}