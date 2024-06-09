// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

//import { LocationHelper } from './location-helper.js';
//import { MapManager } from "./map-manager.js";

function updateLocation(){
    const previousLat = document.getElementById("latitude").value;
    const previousLong = document.getElementById("longitude").value;
    
    // Position schon eingetragen?
    if (previousLat == "" || previousLong == "") {
        // Koordinaten sind nicht gesetzt, also finde die aktuelle Position
        LocationHelper.findLocation((locationHelper) => {
            var latitude = locationHelper.latitude;
            var longitude = locationHelper.longitude;

            // Koordinaten in die Formulare eintragen
            document.getElementById("latitude").value = latitude;
            document.getElementById("longitude").value = longitude;
            document.getElementById('sLatitude').value = latitude;
            document.getElementById('sLongitude').value = longitude;

            // Aktualisiere die Karte mit den neuen Koordinaten und Markern
            updateMapAndMarkers(latitude, longitude);
        });
    } else {
        updateMapAndMarkers(previousLat, previousLong);
    }
}

function updateMapAndMarkers(latitude, longitude) {
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
        var listName = listElement.substring(0, listElement.indexOf('(') - 1);
        var listLatitudeStr = listElement.substring(listElement.indexOf('(') + 2, listElement.indexOf(','));
        var listLongitudeStr = listElement.substring(listElement.indexOf(',') + 1, listElement.indexOf(')'));
        
        // Objekt listTag mit Ortsnamen, Breiten- und Längengrad
        var listTag = {
            name: listName,
            location:{
                latitude: listLatitudeStr,
                longitude: listLongitudeStr
            }
        };

        //Fügt listTag in unser Array tagList ein
        tagList.push(listTag);
    }

    // Marker auf der Karte wird aktualisiert 
    map.updateMarkers(latitude,longitude,tagList);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");
    updateLocation();
    console.log("Location updated");
});