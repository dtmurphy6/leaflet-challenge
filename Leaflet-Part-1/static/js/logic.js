
// Steps for Leaflet_Part_1:
// Get dataset from https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php.
// Use Leaflet to create a map that plots all earthquakes from dataset based on longitude and latitude.
// Data markers on the map should reflect the magnitude of each earthquake by their size and depth (with color).
// Hint: the depth of the earth can be found and used as the third coordinate for each earthquake.
// Must include popups with additional information about an earthquake when its marker is clicked.
// Must create a legend that provides context for map data.

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var colorsArray = ["#6ec7fa", "#78a3dc", "#7e81b6", "#7a608d", "#6d4363", "#582a3c"];
var geojson;

function createMap(earthquakes) {
    // Create the tile layer (background of our map).
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
// Create a baseMaps object to hold the lightmap layer.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
// Create an overlayMaps object to hold the earthquakes layer.
    var overlayMaps = {
        "All Earthquakes": earthquakes
    };
// Create the map object with options.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [street, earthquakes]
    });
 // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
 L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Legend for map - used this site: https://codepen.io/haakseth/pen/KQbjdO
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Depth</h4>";
    div.innerHTML += '<i style="background: #6ec7fa"></i><span>-10-10</span><br>';
    div.innerHTML += '<i style="background: #78a3dc"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: #7e81b6"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: #7a608d"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: #6d4363"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: #582a3c"></i><span>90+</span><br>';

    return div;
};

legend.addTo(myMap);


};

function createMarkers(data) {
    var earthquakeFeatures = data.features;
    var earthquakeMarkers = [];

    // make a function to determine color based on depth of earthquake
    function color(depth) {
        var depthColor = "";
        if (depth < 10) {
            depthColor = colorsArray[0];
        } else if (depth < 30) {
            depthColor = colorsArray[1];
        } else if (depth < 50) {
            depthColor = colorsArray[2];
        } else if (depth < 70) {
            depthColor = colorsArray[3];
        } else if (depth < 90) {
            depthColor = colorsArray[4];
        } else {
            depthColor = colorsArray[5];
        };
        return depthColor;
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // Make a GeoJSON layer that contains the features array
    // Run onEachFeature function for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeFeatures, {
        onEachFeature: onEachFeature,
        //this code edits each marker depending on each earthquake's magnitude and depth
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: parseFloat(feature.properties.mag) * 4,
                fillColor: color(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 6,
                fillOpacity: 0.9
            });
        }
    });
    createMap(earthquakes)
};

d3.json(url).then(function(data) {
    // console.log(data.features);
    // console.log(data.features[0])

    createMarkers(data);

});