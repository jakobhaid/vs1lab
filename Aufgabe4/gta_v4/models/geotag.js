// File origin: VS1LAB A3

/**
* This script is a template for exercise VS1lab/Aufgabe3
* Complete all TODOs in the code documentation.
*/

/**
* A class representing geotags.
* GeoTag objects should contain at least all fields of the tagging form.
*/

class GeoTag {
    constructor(name, location, hashtag) {
        this.name = name;
        this.location = location;
        this.hashtag = hashtag;
    }
    
    /* constructor(name, latitude, longitude, hashtag, id) {
        this.Name = name;
        this.Latitude = latitude;
        this.Longitude = longitude;
        this.Hashtag = hashtag;
        this.Id = id;
    }
    
    get name() { return this.Name; }
    set name(value) { this.Name = value; }

    get latitude() { return this.Latitude; }
    set latitude(value) { this.Latitude = value; }

    get longitude() { return this.Longitude; }
    set longitude(value) { this.Longitude = value; }

    get hashtag() { return this.Hashtag; }
    set hashtag(value) { this.Hashtag = value; }

    get id(){ return this.Id; }
    set id(value) { this.Id = value; } */
}

module.exports = GeoTag;