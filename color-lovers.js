<!DOCTYPE html>
<html>
  <head>
    <title>Instagram Map</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
      <style>
      html, body, #map {
        height: 100%;
        margin: 0px;
        padding: 0px;
      }
      </style>
    <script src="http://code.jquery.com/jquery-latest.min.js"></script> <!--JQUERY SCRIPT -->
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script> <!--GOOGLE MAPS SCRIPT -->
    <script> 

      //START OF DRAW FUNCTION

      var draw = function(id, mapOptions, positions) {

      var map = new google.maps.Map(document.getElementById(id), mapOptions);

      var myLatlng = new google.maps.LatLng(40.7293, -73.9906);

      //set up some empty arrays to use
      var markers = [];
      var infoWindows = [];
      var popUps = [];

      //create all of the markers on the map
      for (i in positions) {

      // Adding a marker to the map
        markers[i] = new google.maps.Marker({
          position: positions[i].map,
          map: map,
          title: positions[i].title,
          icon: 'http://png-3.findicons.com/files/icons/480/weather/32/sunny.png' //url to images
          });

      }

       //loop through the markers, and add pop-up windows to them
       for (i in markers) {

      //create a template with two placeholder to replace
      var popUpTemplate = '<div class="content"><a href="{{link}}">{{content}}</a></div>';

      //replace the content placeholder
      popUps[i] = popUpTemplate.replace('{{content}}', positions[i].title);

      //replace the link placeholder
      popUps[i] = popUps[i].replace('{{link}}', positions[i].link);

      //create a new info window
      infoWindows[i] = new google.maps.InfoWindow({
      //the contents is the string-replaced template we created within this loop
      content:popUps[i]
      });

      //when a marker is clicked on
      google.maps.event.addListener(markers[i], 'click', function(innerKey) {
      return function() {
          //comment out the for loop persist each info window
          for (j in markers) {
            infoWindows[j].close(map, markers[j]);
          }

          //open the infoWindow related to the marker clicked on
          infoWindows[innerKey].open(map, markers[innerKey]);
      }
    }(i));
  }
} //end of the initiazlize function

    //END OF DRAW FUNCTION

    //START OF INSTAGRAM AND MAP

            $(document).ready(function(){

        $.getJSON("http://cooper-union-instagram-proxy.herokuapp.com/search/tag/sunnynyc?count=50", function(response){

                  console.log(response.length); 

          var mapOptions = {
          zoom: 12,
          center: new google.maps.LatLng(40.7293, -73.9906) //centered at cooper, but zoomed to manhattan
          };
          var positions = [];

            for(var i=0; i<response.length; i++) {
              if(response[i].location != null) {
                var latitude = response[i].location.latitude;
                var longitude = response[i].location.longitude;

                positions.push(
                {
                  'title':response[i].caption.text,
                  'map': new google.maps.LatLng(latitude, longitude),
                  'link': response[i].link, // link to instagram post
                  'icon': 'http://png-3.findicons.com/files/icons/480/weather/32/sunny.png'
                });
              };
            };
          draw('map', mapOptions, positions);  

       }); //closes getJSON

     }); //closes readyfunction
    
    //END OF INSTAGRAM AND MAP

</script>
</head>
<body>
    <div id="map"></div>
</body>
</html>

