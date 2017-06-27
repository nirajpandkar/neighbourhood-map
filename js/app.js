var markers=[];
var marker;
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
    //self.markersArray().push([marker]);
    // Extend the map boundaries to encompass all the markers
    bounds.extend(marker.position);

    // Onclick event listener to open infoWindow at each marker.
    marker.addListener('click', function() {
        fillInfoWindow(this, infoWindow);
        toggleBounce(this);
    });
};

// not required to be removed
document.getElementById('show-listing').addEventListener('click', showMarkers);
document.getElementById('hide-listing').addEventListener('click', function(){
    hideMarkers(markers);
});


function showMarkers(){
    for(var i=0; i<markers.length; i++){


        markers[i].setMap(map);
        bounds.extend(markers[i].position);

    }
    //map.fitBounds(bounds);
}

function hideMarkers(markers){
    for(var i=0; i<markers.length; i++){
        markers[i].setMap(null);
    }
}

function toggleBounce(marker) {

    for(var i=0;i<markers.length;i++){
        markers[i].setAnimation(null);
    }
    if(marker){
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }


}

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


var ViewModel = function(){
    var self = this;
    self.markersArray = ko.observableArray(places);

    self.searchString = ko.observable();
    self.searchResults = ko.computed(function() {
        var string = self.searchString();
        if(string == null){
            showMarkers();
            return places;
        }
        else{
            hideMarkers(markers);
            return ko.utils.arrayFilter(places, function(place) {
                if(place.title.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
                    addMarker(place);
                    return place;
                }
            });
        }
    });


};


ko.applyBindings(ViewModel);