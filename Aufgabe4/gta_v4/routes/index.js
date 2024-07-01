// File origin: VS1LAB A3, A4

/**
* This script defines the main router of the GeoTag server.
* It's a template for exercise VS1lab/Aufgabe3
* Complete all TODOs in the code documentation.
*/

//Define module dependencies.
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

/**
* The module "geotag" exports a class GeoTagStore. 
* It represents geotags.
*/
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const geoTagStore = new GeoTagStore();

// App routes (A3)
router.get('/', (req, res) => {
  const { latitude, longitude } = req.query;
  res.render('index', { taglist: geoTagStore.getAll(), latitude, longitude })
});


router.post('/tagging', (req,res) => {
  const {name, latitude, longitude, hashtag} = req.body;
  const newGeoTag = new GeoTag(name, parseFloat(latitude), parseFloat(longitude), hashtag);

  geoTagStore.addGeoTag(newGeoTag);
  res.redirect('/');
})

router.post('/discovery', (req,res) => {
  const {latitude, longitude, keywords} = req.body;
  const searchGeoTags = geoTagStore.searchNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), 100, keywords);

  res.render('index', {taglist: searchGeoTags, latitude : latitude, longitude: longitude});
})



// API routes (A4)

/**
* Route '/api/geotags' for HTTP 'GET' requests.
* (http://expressjs.com/de/4x/api.html#app.get.method)
*
* Requests contain the fields of the Discovery form as query.
* (http://expressjs.com/de/4x/api.html#req.query)
*
* As a response, an array with Geo Tag objects is rendered as JSON.
* If 'searchterm' is present, it will be filtered by search term.
* If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
*/

router.get('/api/geotags', (req, res) => {
  console.log("router.post /api/geotags GET aufgerufen");
  const { searchterm, latitude, longitude, radius } = req.query;
  let tags = geoTagStore.getNearbyGeoTags(latitude, longitude, radius || 10);
  if (searchterm) {
    tags = tags.filter(tag => tag.name.includes(searchterm) || tag.hashtag.includes(searchterm));
  }

  res.json(tags);
});




/**
* Route '/api/geotags' for HTTP 'POST' requests.
* (http://expressjs.com/de/4x/api.html#app.post.method)
*
* Requests contain a GeoTag as JSON in the body.
* (http://expressjs.com/de/4x/api.html#req.body)
*
* The URL of the new resource is returned in the header as a response.
* The new resource is rendered as JSON in the response.
*/

router.post('/api/geotags', (req, res) => {
  console.log("router.post /api/geotags POST aufgerufen");
  const { name, latitude, longitude, hashtag } = req.body;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({ error: "Name, latitude, and longitude are required" });
  }

  const newTag = new GeoTag(name, new Location(parseFloat(latitude), parseFloat(longitude)), hashtag);
  geoTagStore.addGeoTag(newTag);

  res.status(201).json(newTag);
});




/**
* Route '/api/geotags/:id' for HTTP 'GET' requests.
* (http://expressjs.com/de/4x/api.html#app.get.method)
*
* Requests contain the ID of a tag in the path.
* (http://expressjs.com/de/4x/api.html#req.params)
*
* The requested tag is rendered as JSON in the response.
*/

router.get('/api/geotags/:id', (req, res) => {
  console.log("router.post /api/geotags/:id GET aufgerufen");
  const { id } = req.params;
  const tag = geoTagStore.getGeoTagById(id);

  if (!tag) {
    return res.status(404).json({ error: "GeoTag not found" });
  }

  res.status(201).json(tag);
});




/**
* Route '/api/geotags/:id' for HTTP 'PUT' requests.
* (http://expressjs.com/de/4x/api.html#app.put.method)
*
* Requests contain the ID of a tag in the path.
* (http://expressjs.com/de/4x/api.html#req.params)
* 
* Requests contain a GeoTag as JSON in the body.
* (http://expressjs.com/de/4x/api.html#req.query)
*
* Changes the tag with the corresponding ID to the sent value.
* The updated resource is rendered as JSON in the response. 
*/

router.put('/api/geotags/:id', (req, res) => {
  console.log("router.post /api/geotags/:id PUT aufgerufen");
  const { id } = req.params;
  const { name, latitude, longitude, hashtag } = req.body;

  const updatedTag = geoTagStore.update(id, {
    name,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    hashtag
  });

  if (!updatedTag) {
    return res.status(404).json({ error: "GeoTag not found" });
  }

  res.status(201).json(updatedTag);
});




/**
* Route '/api/geotags/:id' for HTTP 'DELETE' requests.
* (http://expressjs.com/de/4x/api.html#app.delete.method)
*
* Requests contain the ID of a tag in the path.
* (http://expressjs.com/de/4x/api.html#req.params)
*
* Deletes the tag with the corresponding ID.
* The deleted resource is rendered as JSON in the response.
*/

router.delete('/api/geotags/:id', (req, res) => {
  console.log("router.post /api/geotags/:id DELETE aufgerufen");
  const { id } = req.params;

  const deletedTag = geoTagStore.removeGeoTag(id);

  if (!deletedTag) {
    return res.status(404).json({ error: "GeoTag not found" });
  }

  res.status(201).json(deletedTag);
});
//fetch('http://localhost:3000/api/geotags/0', {method: 'DELETE'}).then(response => response.json());

module.exports = router;