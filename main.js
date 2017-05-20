$(function(){
	$("#parent").hide();
	$("#win").hide();
	$("#lose").hide();
	$("#lives").html("Lives: " + GUESSES);
});

$("#startButton").click(function(){
	$("#startButton").hide();
	$("#parent").show();
	initMap();
	getRandom();

});

$("#lose").find("#restart").click(function(){
	$("#win").hide();
	$("#lose").hide();
	$("#parent").show();
	markers = [];
	initMap();
	getRandom();
	
});

$("#win").find("#restart").click(function(){
	$("#win").hide();
	$("#lose").hide();
	$("#parent").show();
	markers = [];
	initMap();
	getRandom();
	
});

var panorama;
var map;
var map2;
var sv;
var target;
var address;
var markers = [];
const GUESSES = 1;

function initMap(){
        map2 = new google.maps.Map(document.getElementById('map'), {
          center: {lat:37.09024, lng:-95.712891},
          zoom: 3
        });
        $("#lives").html("Lives: " + (GUESSES - markers.length));
        map2.addListener('click', function(event){
        	if(markers.length < GUESSES){
      			addMarker(event.latLng);
      			$("#lives").html("Lives: " + (GUESSES - markers.length));
      			if(markers.length == GUESSES){
      				determineWin();
      			}
      		}
      		
     	 });
}

    function getRandom(){
        var random = {lat: (Math.random()*25)+24, lng: (Math.random()*-58)-66};
        console.log(random)
        target = random;
         sv = new google.maps.StreetViewService();
         console.log(sv)
         panorama = new google.maps.StreetViewPanorama(document.getElementById('panorama'), {
         	linksControl: false,
            panControl: false,
            enableCloseButton: false,
            addressControl: false
         });
         
         sv.getPanorama({location: random, radius: 50}, processSVData);
        
        map = new google.maps.Map("panorama", {
          center: random,
          zoom: 16,
          streetViewControl : false
        })
        map.setVisible(false);
        
      }

      function processSVData(data, status){
        console.log(status)
          console.log(data)
        if (status === 'OK'){
          panorama.setPano(data.location.pano);
          
          panorama.setPov({
            heading: 270,
            pitch: 0
            
          });
          panorama.setVisible(true);
          address = data.location.description;
        }else{
          console.error("Street View Data not found for this location");
          
          getRandom();
        }
      }



      function addMarker(location){
      	var marker = new google.maps.Marker({
      		position: location,
      		map: map2
      	});
      	marker.setMap(map2);
      	markers.push(marker);
      	markers[0].getPosition().lat();
      }

function determineWin(){
	var distance = getDistance(markers[0].getPosition(), target);
	console.log(distance);
	$("#parent").hide();
	if(distance < 643738){
		$("#win").show();
		$("#win").find("#results").html("Your guess was " + miles(distance) + " miles away.");
	}else{
		$("#lose").show();
		$("#lose").find("#results").html("Your guess was " + miles(distance) + " miles away.");
	}
}

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat());
  var dLong = rad(p2.lng - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

var miles = function(m){
	return m/1609.344;
}