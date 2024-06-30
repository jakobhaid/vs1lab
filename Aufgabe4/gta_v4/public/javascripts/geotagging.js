// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...

const tagForm = document.getElementById('tag-form');
const discoveryFilterForm = document.getElementById('discoveryFilterForm');
var manager = new MapManager();

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
let latitude_output = document.getElementById("latitude");
let longitude_output = document.getElementById("longitude");
let latitude_hidden = document.getElementById("latitude-hidden");
let longitude_hidden = document.getElementById("longitude-hidden");

function updateLocation() {

    if (latitude_output.value && longitude_output.value) {
        const locationHelper = new LocationHelper(latitude_output.value, longitude_output.value);
        updateMap(locationHelper);
    } else {
        LocationHelper.findLocation(function (locationHelper){
            //Nicht vorhandene Koordinaten --> Location Helper Aufruf
            latitude_output.value = locationHelper.latitude;
            longitude_output.value = locationHelper.longitude;
            latitude_hidden.value = locationHelper.latitude;
            longitude_hidden.value = locationHelper.longitude;
            updateMap(locationHelper);
        });
    }
}

function updateMap(locationHelper) {

    manager.initMap(locationHelper.latitude, locationHelper.longitude);
    let currentTags = getAllTagsInDocument();
    console.log(currentTags);
    manager.updateMarkers(locationHelper.latitude, locationHelper.longitude, currentTags);

    const oldImage = document.getElementById('mapView');
    const mapSubtitle = document.getElementById('mapSubtitle');

    oldImage.remove();
    mapSubtitle.remove();

}

function getAllTagsInDocument() {

    let list = document.getElementById("discoveryResults").getElementsByTagName("li");
    let tags = [];

    for (let li of list) {
        let element = li.innerHTML;
        //Format: NAME ( latitude,longitude) #hashtag
        let elementName = element.substring(0, element.indexOf('(') - 1);
        let elementLatitude = element.substring(element.indexOf('(') + 2, element.indexOf(','));
        let elementLongitude = element.substring(element.indexOf(',') + 1, element.indexOf(')'));

        let tag = {
            name: elementName,
            location: {
                latitude: elementLatitude,
                longitude: elementLongitude
            }
        };
        tags.push(tag);

    }
    return tags;

}

tagForm.addEventListener('submit', function(event){
    event.preventDefault(); // Prevent the default form submission

    console.log("tagForm eventListener submit");

    //Get formula data
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const name = document.getElementById('name').value;
    const hashtag = document.getElementById('hashtag').value;

    //Create a new tag
    const tag = {
        latitude: latitude,
        longitude: longitude,
        name: name,
        hashtag: hashtag
    }

    //Send the tag to the server
    fetch('/api/geotags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tag)
    })
        .then(response => response.json())
        .then(data => {
                console.log('Success:', data);
                //Adding the new tag to the map
                let taglist_json = document.getElementById('map').getAttribute('data-tags');
                let taglist;
                taglist = JSON.parse(taglist_json);
                taglist.push(data);
                document.getElementById('map').setAttribute('data-tags', JSON.stringify(taglist));
                manager.updateMarkers(latitude, longitude, taglist);

                //Adding the new tag to the discovery results
                let discoveryResults = document.getElementById('discoveryResults');
                let tag = document.createElement('li');
                tag.textContent = `ID: ${data.id} , 
                ${data.name} (${data.location.latitude}, 
                ${data.location.longitude}) ${data.hashtag}`;
                discoveryResults.appendChild(tag);
            }
        )
        .catch((error) => {
            console.error('Error:', error);
        });
});


discoveryFilterForm.addEventListener('submit', function(event){
    event.preventDefault(); // Prevent the default form submission

    console.log("discoveryFilterForm eventListener submit");

    //Get formula data
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const searchterm = document.getElementById('search').value;

    let params = new URLSearchParams({
        searchterm: searchterm,
        latitude: latitude,
        longitude: longitude,
        radius: 10
    });

    fetch(`/api/geotags?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
            //Update the map with the search results
            console.log("latitude: " + latitude);
            console.log("longitude: " + longitude);
            manager.updateMarkers(latitude, longitude, data);

            //Update the discovery results
            let discoveryResults = document.getElementById('discoveryResults');
            discoveryResults.replaceChildren();
            for (const tag of data) {
                let tagElement = document.createElement('li');
                tagElement.textContent =
                    `${tag.name} (${tag.location.latitude},
                    ${tag.location.longitude}) ${tag.hashtag}`;
                discoveryResults.appendChild(tagElement);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });


});

document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});