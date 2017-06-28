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
        FourSquareAPI(place);
    });
};

// Hide and the show the markers as and when required
function showMarkers(){
    for(var i=0; i<markers.length; i++){
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
}

function hideMarkers(markers){
    for(var i=0; i<markers.length; i++){
        markers[i].setMap(null);
    }
}

// Bounce the marker when clicked or when referenced
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
        infoWindow.setContent('<div>' + marker.title + '<br><a href="#" data-toggle="modal" data-target="#myModal" data-bind="click: showInfo">More Info..</a></div>');
        infoWindow.open(map, marker);

        // Marker property cleared if window closed
        infoWindow.addListener('closeclick', function(){
            infoWindow.setMarker(null);
        });
    }

}

function FourSquareAPI(place){
    var client_id = "GJXKB1TLL4RNYI2R3WMTGCGNZR2XYJDD3H4R2TAAMCER3S43";
    var client_secret = "Q4TNZRLJYH5CKCZIUWUNH5XYK0UUG3WLRRQXWCK2JF5SDMRL";

    var date = new Date();

    var year = date.getFullYear();

    //Index of the month starts from 0
    var month = date.getMonth()+1;
    //Also formatted to be two-digit number
    if(month<10) month = "0" + month;

    var day = date.getDate();
    //Formatted to be two-digit if not
    if(day<10) day = "0" + day;

    //For latest version
    var v = year + "" + month + "" + day;

    var foursquare_url = "https://api.foursquare.com/v2/venues/explore?ll=" + place.location.lat + "," +
        place.location.lng + "&client_id=" + client_id + "&client_secret=" + client_secret +
        "&query=" + place.title + "&v=" + v;

    $.ajax({
        url: foursquare_url,
        dataType: "json",
        async: true,
        success: function(data){
            var res = data.response.groups[0].items[0].venue;
            var contact_number = res.contact.formattedPhone;
            var rating = res.rating;
            self.item_name(place.title);
            self.url(res.url);
            self.categories(res.categories[0].pluralName);

            if(rating) self.rating(rating);
            else self.rating("N/A");

            if(contact_number) self.contact(contact_number);
            else self.contact("N/A");
        },
        error: function(e) {
            self.error_message("Couldn't retrieve data. Try again later!");
        }
    })


}

var ViewModel = function(){
    var self = this;

    self.searchString = ko.observable();
    self.item_name = ko.observable();
    self.url = ko.observable();
    self.rating = ko.observable();
    self.status_hours = ko.observable();
    self.contact = ko.observable();
    self.categories = ko.observable();
    self.error_message = ko.observable();

    // Filter functionality
    self.searchResults = ko.computed(function() {
        var string = self.searchString();
        if(!string){
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

    // Show modal when clicked
    self.showInfo = function(place){
        FourSquareAPI(place);

        for(var i=0;i<markers.length;i++){
            if(markers[i].title == place.title){
                toggleBounce(markers[i]);
            }
        }

    };
};



ko.applyBindings(ViewModel);