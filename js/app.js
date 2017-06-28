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

    places.forEach(function(place){
        addMarker(place);
    });

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
    markers.forEach(function(marker){
        marker.setVisible(true);
        bounds.extend(marker.position);
    });
}

function hideMarkers(){
    markers.forEach(function(marker){
        marker.setVisible(false);
    });
}

// Bounce the marker when clicked or when referenced
function toggleBounce(marker) {
    markers.forEach(function(marker){
        marker.setAnimation(null);
    });

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
    var client_id = credentials.client_id;
    var client_secret = credentials.client_secret;

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
        async: true})
        .done(function(data){
            var contact_number = data.response.groups[0].items[0].venue.contact.formattedPhone;
            var rating = data.response.groups[0].items[0].venue.rating;
            self.item_name(place.title);
            self.url(data.response.groups[0].items[0].venue.url);
            self.categories(data.response.groups[0].items[0].venue.categories[0].pluralName);

            self.rating(rating || "N/A");

            self.contact(contact_number || "N/A");
        })
        .fail(function() {
            self.error_message("Couldn't retrieve data. Try again later!");
        });

}

// Display error message if Google Maps fail to load for some reason
function mapsError(){
    self.error_message("Couldn't load Google Maps. Try again later!");
    alert(self.error_message());
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
        if(string == null){
            showMarkers();
            return places;
        }
        else{
            hideMarkers();
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

        markers.forEach(function(marker){
            if(marker.title == place.title){
                toggleBounce(marker);
            }
        });

    };


    //initMap();
};



ko.applyBindings(ViewModel);