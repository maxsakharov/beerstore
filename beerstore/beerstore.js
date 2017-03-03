var express     = require('express');
var bodyParser  = require('body-parser');
var path        = require('path');
var metrics     = require(path.resolve('./middleware/metrics'));
var beerStore   = require(path.resolve('./service/store'));
var beerApi     = require(path.resolve('./service/beer-api'));

var app = express();

/**
 * middlwares
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(metrics.middleware);

metrics.handleUpsrream();

/**
 * ping pong
 */
app.get('/ping', (req, res) => res.send({"state": "up"}).end());

/**
 * return application metrics
 */
app.get('/metrics', metrics.response);

/**
 * add beer to favourites
 */
app.post('/beer/favourites', beerStore.addBeer);

/**
 * return favourite beer by name
 */
app.get('/beer/favourites/:name', beerStore.getBeer);

/**
 * return favourite beers
 */
app.get('/beer/favourites', beerStore.getBeers);

/**
 * sip your favourite beer
 */
app.get('/beer/sip/:id', beerStore.sip);

/**
 * desribe beer for you
 */
app.get('/description', beerApi.description);


app.listen(3000, function () {
    console.log('App listening on port 3000!')
});