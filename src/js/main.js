//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;
var ich = require("icanhaz");
var $ = require('jQuery')
var change = require("./change.geo.json");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

var geojson;



// function getColor(d) {
//     return d > 0.8  ? '#093A63' :
//            d > 0.6  ? '#f1eef6' :
//            d > 0.4  ? '#bdc9e1' :
//            d > 0.2   ? '#74a9cf' :
//            d > 0   ? '#2b8cbe' :
//                       '#093A63';
// }

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

  map.scrollWheelZoom.disable();


  $(".type-button").click(function() {

    var colors  = {
      low_pct: "#bacdea",
      medium_pct: "#599dc1",
      high_pct: "#026672"

    }

    function getColor(d) {
      var column = colors[type];

        return d > 0   ? column :
                          '#B3B3B3';
    }

    $("#menu a.selected").removeClass("selected");
    $(this).addClass("selected");

    var type = $(this).data("type");
      if (geojson) map.removeLayer(geojson);

      $(".change1").css("background-color", colors[type]);

    $("#menu a").css("background-color", "#ffffff");
    $("#menu a.selected").css("background-color", colors[type]);

    document.body.className = type;

    

    var style = function(feature) {
      var column = feature.properties[type];
      return {
        color: getColor(column, type),
        fillColor: getColor(column, type),
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
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
        households: (props.new_households).toFixed(0),
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


  });

$(".type-button:first").click();