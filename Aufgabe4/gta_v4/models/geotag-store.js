// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTag = require("./geotag");
const Location = require('./Location');

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
class InMemoryGeoTagStore{

    // TODO: ... your code here ...
     #privateGeoTag = [];
     #currentId = 0;

    constructor() {
        this.fillStoreWithExamples();
        console.log(this.#privateGeoTag);
    }

    addGeoTag(geoTag) {
        geoTag.id = this.#currentId
        this.#currentId++;
        this.#privateGeoTag.push(geoTag);
    }

    removeGeoTag(id){
        const removeTag = this.getGeoTagById(id);
        if (removeTag !== null) {
            this.#privateGeoTag = this.#privateGeoTag.filter(geoTag => geoTag.id.toString() !== id.toString());
        }
        return removeTag || null;
    }

    getNearbyGeoTags(latitude, longitude, radius){
        return this.#privateGeoTag.filter(function (tag) {                  //Filter Methode, führt Fkt aus und geht für
            // jeden geo Tag in #privateGeoTag durch und
            // erstellt neuen Array nur mit elementen für die Bedingung true ist
           console.log("tag: " + tag);
           console.log("tag.latitude: " + tag.location.latitude);
           console.log("tag.longitude: " + tag.location.longitude);
            const distance = Math.sqrt(Math.pow(tag.location.latitude - latitude, 2) + Math.pow(tag.location.longitude - longitude, 2));
            return distance <= radius;
        });
    }

    // getGeoTagById(id){
    //     for (let i = 0; i < this.#privateGeoTag.length; i++) {
    //         //console.log(this.#privateGeoTag[i].id.toString() === id.toString());
    //         if (this.#privateGeoTag[i].id.toString() === id.toString()) {
    //             return this.#privateGeoTag[i];
    //         }
    //     }
    // }

    searchNearbyGeoTags(latitude, longitude, radius, keyword){
        const nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude, radius);
        return nearbyGeoTags.filter(function (tag) {
            return (tag.name.includes(keyword) || tag.hashtag.includes(keyword));
        });
    }

    getAll() {
        return this.#privateGeoTag;
    }

    getGeoTagById(id) {
        return this.#privateGeoTag.find(tag => tag.id.toString() === id.toString());
    }

    update(id, updatedFields) {
        const tag = this.getGeoTagById(id);
        if (tag) {
            tag.name = updatedFields.name || tag.name;
            tag.location.latitude = updatedFields.latitude || tag.location.latitude;
            tag.location.longitude = updatedFields.longitude || tag.location.longitude;
            tag.hashtag = updatedFields.hashtag || tag.hashtag;
            return tag;
        }
        return null;
    }

    fillStoreWithExamples(){
            const GeoTagExamples = require('./geotag-examples');
            let exampleList = GeoTagExamples.tagList;
            for (let i = 0; i < exampleList.length; i++){
                console.log("exampleList: " + exampleList[i][0] + ", " +  exampleList[i][1] + ", "+ exampleList[i][2] + ", "+ exampleList[i][3]);
                this.addGeoTag(new GeoTag(exampleList[i][0], new Location(exampleList[i][1], exampleList[i][2]), exampleList[i][3]));
            }
    }
}

module.exports = InMemoryGeoTagStore