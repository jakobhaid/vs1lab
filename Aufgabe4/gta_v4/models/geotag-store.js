// File origin: VS1LAB A3

/**
* This script is a template for exercise VS1lab/Aufgabe3
* Complete all TODOs in the code documentation.
*/

const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

/**
* A class for in-memory-storage of geotags
* 
* Use an array to store a multiset of geotags.
* - The array must not be accessible from outside the store.
* 
* Provide a method 'addGeoTag' to add a geotag to the store.
* 
* Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
* 
* Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
* - The location is given as a parameter.
* - The proximity is computed by means of a radius around the location.
* 
* Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
* - The proximity constrained is the same as for 'getNearbyGeoTags'.
* - Keyword matching should include partial matches from name or hashtag fields. 
*/

class inMemoryGeoTagStore{
    
    InMemoryGeoTags = [];

    constructor() {
        this.InMemoryGeoTags = [];
    }

    addGeoTag(geoTag) {
        this.InMemoryGeoTags.push(geoTag);
    }

    removeGeoTag(name) {
        this.InMemoryGeoTags = this.InMemoryGeoTags.filter(GeoTag => GeoTag.name !== name);
    }

    getNearbyGeoTags(latitude, longitude, radius = 10.0) {
        console.log("GetNearbyGeoTags lat: " + latitude + " long: " + longitude + " rad: " + radius);

        let foundGeoTags = [];

        for (let i = 0; i < this.InMemoryGeoTags.length; i++) {
            const currentTag = this.InMemoryGeoTags[i];

            const distance = this.calcDistance(latitude, longitude, currentTag.getLatitude(), currentTag.getLongitude());

            if (distance <= radius) {
                foundGeoTags.push(this.InMemoryGeoTags[i]);
            }
        }

        return foundGeoTags;
    }

    searchNearbyGeoTags(latitude, longitude, radius = 10.0, keyword) {
        console.log("SearchNearbyGeoTags lat: " + latitude + " long: " + longitude + " rad: " + radius + " key: " + keyword);

        let nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude, radius);

        let foundGeoTags = [];

        for (let i = 0; i < nearbyGeoTags.length; i++) {
            const name = nearbyGeoTags[i].getName();
            const hashtag = nearbyGeoTags[i].getHashtag();

            if (name !== undefined && name.includes(keyword) ||
                hashtag !== undefined && hashtag.includes(keyword)) {
                foundGeoTags.push(nearbyGeoTags[i]);
            }
        }

        return foundGeoTags;
    }

    calcDistance(lat1, lon1, lat2, lon2) {
        const toRad = value => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    getAllGeoTags() {
        let allGeoTags = [];
        for (let i = 0; i < this.InMemoryGeoTags.length; i++) {
            allGeoTags.push(this.InMemoryGeoTags[i]);
        }
        return allGeoTags;
    }

    examples(){
        let tagList = GeoTagExamples.tagList;
        for (let i = 0; i < (GeoTagExamples.tagList).length; i++) {
                this.addGeoTag(new GeoTag(tagList[i][0], tagList[i][1], tagList[i][2], tagList[i][3]));
        }
    }
}

module.exports = inMemoryGeoTagStore;   // Semicolon hinzugefügt
