// File origin: VS1LAB A3

/**
* This script defines the main router of the GeoTag server.
* It's a template for exercise VS1lab/Aufgabe3
* Complete all TODOs in the code documentation.
*/

//Define module dependencies.
const express = require('express');
const router = express.Router();

/**
* The module "geotag" exports a class GeoTagStore. 
* It represents geotags.
* 
* TODO: implement the module in the file "../models/geotag.js"
*/
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
* The module "geotag-store" exports a class GeoTagStore. 
* It provides an in-memory store for geotag objects.
* 
* TODO: implement the module in the file "../models/geotag-store.js"
*/
// eslint-disable-next-line no-unused-vars
const inMemoryGeoTagStore  = require('../models/geotag-store');
const inMemoryStore = new inMemoryGeoTagStore();

inMemoryStore.examples(); // Lade die GeoTag-Beispiele in unser Array

//const GeoTagExamples = require('../models/geotag-examples');
//const examples = new GeoTagExamples();

/**
* Route '/' for HTTP 'GET' requests.
* (http://expressjs.com/de/4x/api.html#app.get.method)
*
* Requests cary no parameters
*
* As response, the ejs-template is rendered without geotag objects.
*/

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  const { latitude, longitude } = req.query;
  
  //console.log("req:" + req);
  //console.log("req.body:" + req.body.lattude);
  //console.log("req.query:" + req.query.lattude);

  res.render('index', { taglist: inMemoryStore.getAllGeoTags(), latitude, longitude });
});

/**
* Route '/tagging' for HTTP 'POST' requests.
* (http://expressjs.com/de/4x/api.html#app.post.method)
*
* Requests cary the fields of the tagging form in the body.
* (http://expressjs.com/de/4x/api.html#req.body)
*
* Based on the form data, a new geotag is created and stored.
*
* As response, the ejs-template is rendered with geotag objects.
* All result objects are located in the proximity of the new geotag.
* To this end, "GeoTagStore" provides a method to search geotags 
* by radius around a given location.
*/

// TODO: ... your code here ...
router.post('/tagging', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  
  /*
  console.log("name:" + req.body.name);
  console.log("latitude:" + req.body.latitude);
  console.log("longitude:" + req.body.longitude);
  console.log("hashtag:" + req.body.hashtag);
  */
  console.log('POST /tagging route called');

  const newGeoTag = new GeoTag(name, parseFloat(latitude), parseFloat(longitude), hashtag);
  inMemoryStore.addGeoTag(newGeoTag);

  const taglistInMemory = inMemoryStore.getAllGeoTags();
  res.render('index', { taglist: taglistInMemory, latitude: latitude, longitude: longitude });
});

/**
* Route '/discovery' for HTTP 'POST' requests.
* (http://expressjs.com/de/4x/api.html#app.post.method)
*
* Requests cary the fields of the discovery form in the body.
* This includes coordinates and an optional search term.
* (http://expressjs.com/de/4x/api.html#req.body)
*
* As response, the ejs-template is rendered with geotag objects.
* All result objects are located in the proximity of the given coordinates.
* If a search term is given, the results are further filtered to contain 
* the term as a part of their names or hashtags. 
* To this end, "GeoTagStore" provides methods to search geotags 
* by radius and keyword.
*/

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {
  const { sLatitude, sLongitude, searchterm } = req.body;
  
  /*
  console.log("sLatitude:" + req.body.sLatitude);
  console.log("sLongitude:" + req.body.sLongitude);
  console.log("searchterm:" + req.body.searchterm);
  */
  console.log('POST /discovery route called');

  const discoverGeoTags = inMemoryStore.searchNearbyGeoTags(parseFloat(sLatitude), parseFloat(sLongitude), 1000000, searchterm);
  res.render('index', { taglist: discoverGeoTags, latitude: sLatitude, longitude: sLongitude });
});

module.exports = router;


// zum starten:
// cd Aufgabe3/gta_v3
// npm start