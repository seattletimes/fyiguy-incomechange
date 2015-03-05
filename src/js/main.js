//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

var ich = require("icanhaz");

var change = require("./change.geo.json");

var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

function getColor(d) {
    return d > 800  ? '#004080' :
           d > 600  ? '#1D55A3' :
           d > 400  ? '#2561DB' :
           d > 200   ? '#5A82EC' :
           d > 0   ? '#C0CFFF' :
                      '#C0CFFF';
}

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 2,
    fillOpacity: 0.4
  });
  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  geojson.bringToBack();
}


  var style = function(feature) {
    return {
      color: '#ffffff',
      fillColor: getColor(feature.properties.new_households),
      weight: 0.5,
      opacity: 0.9,
      fillOpacity: 0.7
    }
  };


    function onEachFeature(feature, layer) {

      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      });

      var props = feature.properties;

      layer.bindPopup(ich.popup({
        name: props.namelsad10,
        households: props.new_households,
        low: props.low_pct * 100,
        lowText: (props.low_pct * 100).toFixed(1),
        medium: props.medium_pct * 100,
        mediumText: (props.medium_pct * 100).toFixed(1),
        high: props.high_pct * 100,
        highText: (props.high_pct * 100).toFixed(1)
      }))
    }

    geojson = window.geojson = L.geoJson(change, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);

  map.scrollWheelZoom.disable();