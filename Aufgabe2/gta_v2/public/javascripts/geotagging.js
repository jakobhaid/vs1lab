// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
  * A class to help using the HTML5 Geolocation API.
  */
class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';

    /**
     * Getter method allows read access to privat location property.
     */
    get latitude() {
        return this.#latitude;
    }

    #longitude = '';

    get longitude() {
        return this.#longitude;
    }

   /**
    * Create LocationHelper instance if coordinates are known.
    * @param {string} latitude 
    * @param {string} longitude 
    */
   constructor(latitude, longitude) {
       this.#latitude = (parseFloat(latitude)).toFixed(5);
       this.#longitude = (parseFloat(longitude)).toFixed(5);
   }

    /**
     * The 'findLocation' method requests the current location details through the geolocation API.
     * It is a static method that should be used to obtain an instance of LocationHelper.
     * Throws an exception if the geolocation API is not available.
     * @param {*} callback a function that will be called with a LocationHelper instance as parameter, that has the current location details
     */
    static findLocation(callback) {
        const geoLocationApi = navigator.geolocation;

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }

        // Call to the HTML5 geolocation API.
        // Takes a first callback function as argument that is called in case of success.
        // Second callback is optional for handling errors.
        // These callbacks are given as arrow function expressions.
        geoLocationApi.getCurrentPosition((location) => {
            // Create and initialize LocationHelper object.
            let helper = new LocationHelper(location.coords.latitude, location.coords.longitude);
            // Pass the locationHelper object to the callback.
            callback(helper);
        }, (error) => {
           alert(error.message)
        });
    }
}

/**
 * A class to help using the Leaflet map service.
 */
class MapManager {

    #map
    #markers

    /**
    * Initialize a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {number} zoom The map zoom, defaults to 18
    */
    initMap(latitude, longitude, zoom = 18) {
        // set up dynamic Leaflet map
        this.#map = L.map('map').setView([latitude, longitude], zoom);
        var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors'}).addTo(this.#map);
        this.#markers = L.layerGroup().addTo(this.#map);
    }

    /**
    * Update the Markers of a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
    */
    updateMarkers(latitude, longitude, tags = []) {
        // delete all markers
        this.#markers.clearLayers();
        L.marker([latitude, longitude]).bindPopup("Your Location").addTo(this.#markers);
        for (const tag of tags) {
            L.marker([tag.location.latitude, tag.location.longitude]).bindPopup(tag.name).addTo(this.#markers);
        }
    }
}

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

/*
Hast du eine Benachrichtigung bekommen, dass ich hier einen Kommentar geschrieben hab?
*/


function updateLocation(){

    // Auslesen der Position mit `findLocation`
    // Pfeil bedeutet 
    LocationHelper.findLocation(function(location) {
        var latitude = location.latitude;
        var longitude = location.longitude;

        // Koordinaten in die Formulare eintragen
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;
        document.getElementById('sLatitude').value = latitude;
        document.getElementById('sLongitude').value = longitude;


        /*
        Vorhandenes Kartenelement durch neues <div>-Element mit ID 'map' ersetzt
        und dem entsprechenden Elternelement im DOM hinzugefügt.
        */
        document.getElementById('mapView').nextElementSibling.remove();
        document.getElementById('mapView').remove();
        var mapDiv = document.createElement('div');
        mapDiv.setAttribute("id", "map");
        document.getElementsByClassName('discovery__map')[0].appendChild(mapDiv);

        // neue Instanz von MapManager
        var map = new MapManager();

        // Initialisiert Karte
        map.initMap(latitude,longitude);

        // Alle <li>-Elemente innerhalb des Elements mit der ID 'discoveryResults' werden abgerufen 
        // und in der Variablen allResults gespeichert.
        var allResults = document.getElementById('discoveryResults').getElementsByTagName('li');

        // leeres Array
        var tagList = Array();


        
        // Schleife durch die li Elemente
        for (var i = 0; i < allResults.length; i++) {

            //Für jedes <li>-Element wird der Textinhalt (innerText) abgerufen und in der Variablen listElement gespeichert. 
            var listElement = allResults[i].innerText;

            // Ortsname, Breiten- und Längengrad wird aus Textinhalt extrahiert
            var listName = listElement.substring(0, listElement.indexOf(' ('));
            var listLatitudeStr = listElement.substring(listElement.indexOf(' (') + 2, listElement.indexOf(', '));
            var listLongitudeStr = listElement.substring(listElement.indexOf(', ') + 2, listElement.indexOf(') '));
            
            // Objekt listTag mit Ortsnamen, Breiten- und Längengrad
            var listTag = {
                location:{
                    latitude: listLatitudeStr,
                    longitude: listLongitudeStr
                },
                name: listName
            };

            //Fügt listTag in unser Array tagList ein
            tagList.push(listTag);
        }

        // Marker auf der Karte wird aktualisiert 
        map.updateMarkers(latitude,longitude,tagList);
    });
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});