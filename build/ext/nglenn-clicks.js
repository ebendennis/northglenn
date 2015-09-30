var home = document.getElementById('home-button');
var ward1 = document.getElementById('ward1-button');
var ward2 = document.getElementById('ward2-button');
var ward3 = document.getElementById('ward3-button');
var ward4 = document.getElementById('ward4-button');

home.onclick = function() {
           getGeoJSON();
           empty();
           map.setView([39.897, -104.985], 13);
        };
ward1.onclick = function() {
            getWard1();
            empty();
            map.setView([39.8938013, -104.966], 15);
        };
ward2.onclick = function(e){
            getWard2();
            empty();
            map.setView([39.91, -104.972], 15);
        };
ward3.onclick = function(e){
            getWard3();
            empty();
            map.setView([39.9019538, -104.9844139], 15);
        };
ward4.onclick = function(e){
            getWard4();
            empty();
            map.setView([39.8879949, -104.9990399], 15);
        };
