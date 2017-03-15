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
        map2.addListener('click', function(event){
        	if(markers.length < GUESSES){
      			addMarker(event.latLng);
      			$("#lives").html("Lives: " + (GUESSES - markers.length));
      		}else{
      			determineWin();
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
	var rangeLat = target.lat - markers[0].getPosition().lat();
	var rangeLng = target.lng - markers[0].getPosition().lng();
	var distance = Math.sqrt(Math.pow(rangeLat, 2) + Math.pow(rangeLng, 2));
	console.log(distance);
}