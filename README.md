# Food Joints (Neighbourhood Map)

> Shows the nearby food joints and displays additional information about them.

Live demo - https://nirajpandkar.github.io/neighbourhood-map/

### Features
* Website built with Bootstrap and custom CSS to improve mobile/tablet/web experience. 
* Filter function to help you find items restaurants easily.
* Dynamic Javascript UI with Knockout JS.
* Asynchronous data handled appropriately to provide seamless user experience.
* Provision of additional data retrieved from 3rd party apps.

### Installation

* Clone the repository
```
$ git clone https://github.com/nirajpandkar/neighbourhood-map.git
```

* Obtain FourSquare credentials(client key and client secret) and replace them in the appropriate [places](https://github.com/nirajpandkar/neighbourhood-map/blob/master/js/app.js#L94)
* Obtain Google Maps API and put it in the appropriate [place](https://github.com/nirajpandkar/neighbourhood-map/blob/master/index.html#L100) 
    * Replace value of `key=` with your own key.

* Run `index.html` file.

### Libraries Used

* [Knockout.js](http://knockoutjs.com/)

### APIs Used

* [Google Maps](https://developers.google.com/maps/)
* [FourSquare](https://developer.foursquare.com/)

### External References

* [Sidebar Nav](https://codediode.io/lessons/198631-design-a-responsive-side-menu-for-bootstrap-4)

### Future Scope

* Add location settings to allow user to change neighbourhood location.
* Add more relevant information about restaurants.
* Persistence of data when app is closed or opened.
* Ability to favorite a location/restaurant.
