var marker;
var markers=[];
var map;
var bounds;
var infoWindow;
function initMap(){
    map = new google.maps.Map(document.getElementById('map'),{
        center: {lat: 18.5028327, lng: 73.8200166},
        zoom: 15
    });


    // variable initializations
    infoWindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();

    for(var i=0;i<places.length;i++){
        addMarker(places[i]);
    }

    map.fitBounds(bounds);
}

// Create an array of markers using places array.
var addMarker = function(place){
    var position = place.location;
    var title = place.title;

    marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: "images/map-marker_36.png"
    });

    // Push marker into markers array
    markers.push(marker);

    // Extend the map boundaries to encompass all the markers
    bounds.extend(marker.position);

    // Onclick event listener to open infoWindow at each marker.
    marker.addListener('click', function() {
        fillInfoWindow(this, infoWindow);
    });
};

// populate the infowindow with appropriate information
function fillInfoWindow(marker, infoWindow){
    if(infoWindow.marker != marker){
        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + marker.title + '</div>');
        infoWindow.open(map, marker);

        // Marker property cleared if window closed
        infoWindow.addListener('closeclick', function(){
            infoWindow.setMarker(null);
        });
    }

}


//var ViewModel = function(){
//    var self = this;
//    self.markers = ko.observableArray([]);
//
//
//};
//
//ko.applyBindings(new ViewModel());

