// File origin: VS1LAB A3, A4

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
*/
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const inMemoryStore = new inMemoryGeoTagStore();

inMemoryStore.examples(); // Lade die GeoTag-Beispiele in unser Array
// App routes (A3)

/**
* Route '/' for HTTP 'GET' requests.
* (http://expressjs.com/de/4x/api.html#app.get.method)
*
* Requests cary no parameters
*
* As response, the ejs-template is rendered without geotag objects.
*/

router.get('/', (req, res) => {
  const { latitude, longitude } = req.query;
  res.render('index', { taglist: inMemoryStore.getAllGeoTags(), latitude, longitude });
});

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

// TODO: ... your code here ...



/////////////////////////////// Mein Code (sponsored by ChatGPT and Google)

router.get('/api/geotags', (req, res) => {
  let resBody;

  if (req.query.latitude == null || req.query.longitude == null) {
      res.status(422);
      res.send();
  }

  const lat = +req.query.latitude;
  const lon = +req.query.longitude;
  const rad = req.query.rad !== undefined ? +req.query.rad : 25;

  console.log(req.query.search);

  if (req.query.search) {
      resBody = tagStore.searchNearbyGeoTags(lat, lon, rad, req.query.search);
  } else {
      resBody = tagStore.getNearbyGeoTags(lat, lon, rad);
  }

  res.send(resBody);
})


/////////////////////////////// Mein Code Ende









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

// TODO: ... your code here ...



/////////////////////////////// Mein Code (sponsored by ChatGPT and Google)

router.post('/api/geotags', (req, res) => {

  tagStore.addGeoTag(req.body['tagName'], req.body['lat'], req.body['long'], req.body['tag']);
  let resBody = tagStore.findByName(req.body['tagName']);
  res.location(`/api/geotags/${req.body['tagName']}`);
  res.status(201);
  res.send(resBody);
})



/////////////////////////////// Mein Code Ende









/**
* Route '/api/geotags/:id' for HTTP 'GET' requests.
* (http://expressjs.com/de/4x/api.html#app.get.method)
*
* Requests contain the ID of a tag in the path.
* (http://expressjs.com/de/4x/api.html#req.params)
*
* The requested tag is rendered as JSON in the response.
*/

// TODO: ... your code here ...


/////////////////////////////// Mein Code (sponsored by ChatGPT and Google)

router.get('/api/geotags/:id', (req, res) => {
  res.send(tagStore.findByName(req.params.id));
})

/////////////////////////////// Mein Code Ende








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

// TODO: ... your code here ...


/////////////////////////////// Mein Code (sponsored by ChatGPT and Google)

router.put('/api/geotags/:id', (req, res) => {
  const resBody = tagStore.updateTag(req.params.id, req.body);
  res.send(resBody);
})

/////////////////////////////// Mein Code Ende






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

// TODO: ... your code here ...


/////////////////////////////// Mein Code (sponsored by ChatGPT and Google)

router.delete('/api/geotags/:id', (req, res) => {
  const resBody = tagStore.findByName(req.params.id);
  tagStore.removeGeoTag(req.params.id);
  res.send(resBody);
})

/////////////////////////////// Mein Code Ende





module.exports = router;
