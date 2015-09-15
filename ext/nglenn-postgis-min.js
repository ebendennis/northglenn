L.mapbox.accessToken = 'pk.eyJ1IjoiZWJlbmRlbm5pcyIsImEiOiJ1M2tMMC0wIn0.HL9nr43JrA_mzhGVBI_B_Q'; // Mapbox API
  var info = document.getElementById('info');
  var markerList1 = document.getElementById('marker-list1');
  var markerList2 = document.getElementById('marker-list2');
  var markerList3 = document.getElementById('marker-list3');
  var markerList4 = document.getElementById('marker-list4');
  function emptyMarkers() {
    markerList1.innerHTML = '';
    markerList2.innerHTML = '';
    markerList3.innerHTML = '';
    markerList4.innerHTML = '';
  };

  var map = L.mapbox.map('map', null, {attributionControl: false}) // Insert basemap ID
      .setView([39.897, -104.985], 13);

      var layers = {
          Satellite: L.mapbox.tileLayer('iconeng.ld19b8nf').setZIndex(1),
          Terrain: L.mapbox.tileLayer('iconeng.88b2767b').setZIndex(2)
      };

      layers.Terrain.addTo(map);
      L.control.layers(layers).addTo(map);

  // Declare Variables
  // Create Global Variable to hold CartoDB layers
  var cartoDBPoints = null;
  var wardPoints = null;
  var cartoDBsfha = null;
  var cartoDBhuc12 = null;
  var cartoDBbounds = null;

  // Set your CartoDB Username
  var cartoDBUsername = "ebendennis";

  // Write SQL Selection Query to be Used on CartoDB Table
  var pointsQuery = "SELECT * FROM northglenn_issues";
      sfhaQuery= "SELECT * FROM northglenn_sfha";
      huc12Query= "SELECT * FROM northglenn_huc12";
      boundsQuery= "SELECT * FROM northglenn_bounds";
      ward1Query= "SELECT ST_Intersection(r.the_geom, m.the_geom) AS intersection_geom, r.* FROM northglenn_issues AS r, northglenn_bounds AS m WHERE m.ward = 1 AND ST_Intersects(r.the_geom, m.the_geom)";
      ward2Query= "SELECT ST_Intersection(r.the_geom, m.the_geom) AS intersection_geom, r.* FROM northglenn_issues AS r, northglenn_bounds AS m WHERE m.ward = 2 AND ST_Intersects(r.the_geom, m.the_geom)";
      ward3Query= "SELECT ST_Intersection(r.the_geom, m.the_geom) AS intersection_geom, r.* FROM northglenn_issues AS r, northglenn_bounds AS m WHERE m.ward = 3 AND ST_Intersects(r.the_geom, m.the_geom)";
      ward4Query= "SELECT ST_Intersection(r.the_geom, m.the_geom) AS intersection_geom, r.* FROM northglenn_issues AS r, northglenn_bounds AS m WHERE m.ward = 4 AND ST_Intersects(r.the_geom, m.the_geom)";

    blueIcon = L.icon({
      iconUrl: 'css/images/blue_marker.svg',
      iconSize: [25,35],
      iconAnchor: [10,35],
      popupAnchor: [0,-35]
  });

    greenIcon = L.icon({
      iconUrl: 'css/images/green_marker.svg',
      iconSize: [25,35],
      iconAnchor: [10,35],
      popupAnchor: [0,-35]
  });

  var circleStyle = {
      radius: 8,
      fillColor: "#556270",
      color: "#fff",
      weight: 1,
      opacity: 0,
      fillOpacity: 0
  };

  function boundsStyle(feature) {
       switch (feature.properties.ward) {
         case 1: return {fillColor: '#ff91ff',fillOpacity: 0.25,color:'#fff', weight:2.5, clickable:false};
         case 2: return {fillColor: '#dd0000',fillOpacity: 0.25,color:'#fff', weight:2.5, clickable:false};
         case 3: return {fillColor: '#ffd92f',fillOpacity: 0.25,color:'#fff', weight:2.5, clickable:false};
         case 4: return {fillColor: '#a65628',fillOpacity: 0.25,color:'#fff', weight:2.5, clickable:false};
       }
       return {
       };
     }

  function huc12Style(feature) {
           return {
             weight: 1.75,
             fillOpacity: 0.1,
             fillColor: '#eee',
             color: 'hotpink',
             opacity:.5,
             clickable:false
           };
         }

  function sfhaStyle(feature) {
    switch (feature.properties.zone_subty) {
      case 'FLOODWAY': return {fillColor: '#0033ff',fillOpacity: 0.6,color:'#eee', weight:0.5, className:'floodway', clickable:false};
      case '0.2 PCT ANNUAL CHANCE FLOOD HAZARD': return {fillColor: '#ffaa00',fillOpacity: 0.6,color:'#fff', weight:0.5, clickable:false};
    }
    return {
      fillColor: '#00aaff',
      fillOpacity: 0.6,
      color:'#eee',
      weight:0.5,
      fillOpacity: 0.6,
      clickable:false
    };
          }


  // Get CartoDB selection as GeoJSON and Add to Map
  function getGeoJSON(){
    if(map.hasLayer(cartoDBPoints)){
        map.removeLayer(cartoDBPoints);
    };
    if(map.hasLayer(wardPoints)){
        map.removeLayer(wardPoints);
    };
    emptyMarkers();
    $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+pointsQuery, function(data) {
      cartoDBPoints = L.geoJson(data,{
        pointToLayer: function(feature,latlng){
          var marker = L.marker(latlng,{icon:greenIcon});
            if (feature.properties.priority <= 2) {marker.setIcon(blueIcon)}
          var content = '<div><h4>' + feature.properties.id + '. ' + feature.properties.location + '</h4><small>' + feature.properties.lat + ', ' + feature.properties.long + '</small><br /><b>Concern Type: </b>' + feature.properties.type + '<br /><b>Fix Type: </b>' + feature.properties.fixtype + '<br /><b>Reported Concern: </b>' + feature.properties.concern + '<br /><b>Actual Concern: </b>' + feature.properties.actual + '<br /><b>Fix: </b>' + feature.properties.fix + '<br /><b>Priority Rating: </b>' + feature.properties.priority + '</div>';
          marker.on('click',function(e){
            marker.closePopup();
            info.innerHTML = content;
          });
          return marker;
        }
      }).addTo(map);
    });
  };

  // Get CartoDB selection as GeoJSON and Add to Map
  function getWard1(){
    if(map.hasLayer(wardPoints)){
        map.removeLayer(wardPoints);
    };
    emptyMarkers();
    $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+ward1Query, function(data) {
      wardPoints = L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, circleStyle);
      },
        onEachFeature: function(feature,layer){
          var item = markerList1.appendChild(document.createElement('li'));
          item.innerHTML = layer.toGeoJSON().properties.location;
          var content = '<div><h4>' + feature.properties.id + '. ' + feature.properties.location + '</h4><small>' + feature.properties.lat + ', ' + feature.properties.long + '</small><br /><b>Concern Type: </b>' + feature.properties.type + '<br /><b>Fix Type: </b>' + feature.properties.fixtype + '<br /><b>Reported Concern: </b>' + feature.properties.concern + '<br /><b>Actual Concern: </b>' + feature.properties.actual + '<br /><b>Fix: </b>' + feature.properties.fix + '<br /><b>Priority Rating: </b>' + feature.properties.priority + '</div>';
          item.onclick = function(e){
            map.setView(layer.getLatLng(), 18);
            layer.closePopup();
            info.innerHTML = content;
          };
          layer.on('click',function(e){
            layer.closePopup();
            info.innerHTML = content;
          });
          return layer;
        }
      }).addTo(map);
    });
  };

  function getWard2(){
    if(map.hasLayer(wardPoints)){
        map.removeLayer(wardPoints);
    };
    emptyMarkers();
    $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+ward2Query, function(data) {
      wardPoints = L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, circleStyle);
      },
        onEachFeature: function(feature,layer){
          var item = markerList2.appendChild(document.createElement('li'));
          item.innerHTML = layer.toGeoJSON().properties.location;
          var content = '<div><h4>' + feature.properties.id + '. ' + feature.properties.location + '</h4><small>' + feature.properties.lat + ', ' + feature.properties.long + '</small><br /><b>Concern Type: </b>' + feature.properties.type + '<br /><b>Fix Type: </b>' + feature.properties.fixtype + '<br /><b>Reported Concern: </b>' + feature.properties.concern + '<br /><b>Actual Concern: </b>' + feature.properties.actual + '<br /><b>Fix: </b>' + feature.properties.fix + '<br /><b>Priority Rating: </b>' + feature.properties.priority + '</div>';
          item.onclick = function(e){
            map.setView(layer.getLatLng(), 18);
            layer.closePopup();
            info.innerHTML = content;
          };
          layer.on('click',function(e){
            layer.closePopup();
            info.innerHTML = content;
          });
          return layer;
        }
      }).addTo(map);
    });
  };

  function getWard3(){
    if(map.hasLayer(wardPoints)){
        map.removeLayer(wardPoints);
    };
    emptyMarkers();
    $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+ward3Query, function(data) {
      wardPoints = L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, circleStyle);
      },
        onEachFeature: function(feature,layer){
          var item = markerList3.appendChild(document.createElement('li'));
          item.innerHTML = layer.toGeoJSON().properties.location;
          var content = '<div><h4>' + feature.properties.id + '. ' + feature.properties.location + '</h4><small>' + feature.properties.lat + ', ' + feature.properties.long + '</small><br /><b>Concern Type: </b>' + feature.properties.type + '<br /><b>Fix Type: </b>' + feature.properties.fixtype + '<br /><b>Reported Concern: </b>' + feature.properties.concern + '<br /><b>Actual Concern: </b>' + feature.properties.actual + '<br /><b>Fix: </b>' + feature.properties.fix + '<br /><b>Priority Rating: </b>' + feature.properties.priority + '</div>';
          item.onclick = function(e){
            map.setView(layer.getLatLng(), 18);
            layer.closePopup();
            info.innerHTML = content;
          };
          layer.on('click',function(e){
            layer.closePopup();
            info.innerHTML = content;
          });
          return layer;
        }
      }).addTo(map);
    });
  };

  function getWard4(){
    if(map.hasLayer(wardPoints)){
        map.removeLayer(wardPoints);
    };
    emptyMarkers();
    $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+ward4Query, function(data) {
      wardPoints = L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, circleStyle);
      },
        onEachFeature: function(feature,layer){
          var item = markerList4.appendChild(document.createElement('li'));
          item.innerHTML = layer.toGeoJSON().properties.location;
          var content = '<div><h4>' + feature.properties.id + '. ' + feature.properties.location + '</h4><small>' + feature.properties.lat + ', ' + feature.properties.long + '</small><br /><b>Concern Type: </b>' + feature.properties.type + '<br /><b>Fix Type: </b>' + feature.properties.fixtype + '<br /><b>Reported Concern: </b>' + feature.properties.concern + '<br /><b>Actual Concern: </b>' + feature.properties.actual + '<br /><b>Fix: </b>' + feature.properties.fix + '<br /><b>Priority Rating: </b>' + feature.properties.priority + '</div>';
          item.onclick = function(e){
            map.setView(layer.getLatLng(), 18);
            layer.closePopup();
            info.innerHTML = content;
          };
          layer.on('click',function(e){
            layer.closePopup();
            info.innerHTML = content;
          });
          return layer;
        }
      }).addTo(map);
    });
  };

  function getBounds(){
    if(map.hasLayer(cartoDBbounds)){
        map.removeLayer(cartoDBbounds);
    };
    $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+ boundsQuery, function(data) {
      cartoDBbounds = L.geoJson(data,{
        style: boundsStyle,
        onEachFeature: function (feature, layer) {
                layer.cartodb_id=feature.properties.cartodb_id;
            }
      }).addTo(map);
    });
  };

  function getHUC12(){
    if(map.hasLayer(cartoDBhuc12)){
        map.removeLayer(cartoDBhuc12);
    };
    $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+ huc12Query, function(data) {
      cartoDBhuc12 = L.geoJson(data,{
        style: huc12Style,
        onEachFeature: function (feature, layer) {
                layer.cartodb_id=feature.properties.cartodb_id;
            }
      });
    });
  };

  function getSFHA(){
    if(map.hasLayer(cartoDBsfha)){
        map.removeLayer(cartoDBsfha);
    };
    $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+ sfhaQuery, function(data) {
      cartoDBsfha = L.geoJson(data,{
        style: sfhaStyle,
        onEachFeature: function (feature, layer) {
                layer.cartodb_id=feature.properties.cartodb_id;
            }
      });
    });
  };

  // Run showAll function automatically when document loads
  $( document ).ready(function() {
    getGeoJSON();
    getBounds();
    getHUC12();
    getSFHA();
  });

  map.on('click', empty);
  // Trigger empty contents when the script
  // has loaded on the page.
  empty();

  function empty() {
    info.innerHTML = '<div><h4>Click a marker</h4></div>';
    }

  var contours = L.mapbox.tileLayer('iconeng.nglenn_contours').setZIndex(9);

  var contoursLink = document.getElementById("contoursLayer");

  contoursLink.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(contours)) {
            map.removeLayer(contours);
            this.className = '';
        } else {
            map.addLayer(contours);
            this.className = 'active';
        }
    };

  var issuesLink = document.getElementById("issuesLayer");

  issuesLink.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(cartoDBPoints)) {
            map.removeLayer(cartoDBPoints);
            this.className = '';
        } else {
            map.addLayer(cartoDBPoints);
            this.className = 'active';
        }
    };

  var boundsLink = document.getElementById("boundsLayer");

  boundsLink.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(cartoDBbounds)) {
            map.removeLayer(cartoDBbounds);
            this.className = '';
        } else {
            map.addLayer(cartoDBbounds);
            this.className = 'active';
        }
    };

  var huc12Link = document.getElementById("basinsLayer");

  huc12Link.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();

          if (map.hasLayer(cartoDBhuc12)) {
              map.removeLayer(cartoDBhuc12);
              this.className = '';
          } else {
              map.addLayer(cartoDBhuc12);
              this.className = 'active';
          }
      };

  var sfhaLink = document.getElementById("sfhaLayer");

  sfhaLink.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (map.hasLayer(cartoDBsfha)) {
                    map.removeLayer(cartoDBsfha);
                    this.className = '';
                } else {
                    map.addLayer(cartoDBsfha);
                    this.className = 'active';
                }
            };


