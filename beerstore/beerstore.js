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
 * return beers available in store
 */
app.post('/beer/favourites', beerStore.addBeer);

/**
 * return beer by given name
 */
app.get('/beer/favoutrites/:name', beerStore.getBeer);

/**
 * add new beer
 */
app.get('/beer/favourites', beerStore.getBeers);

/**
 * sip your favourite beer
 */
app.get('/beer/sip/:id', beerStore.sip);

/**
 * desribe you beer for your beer
 */
app.get('/description', beerApi.description);


app.listen(3000, function () {
    console.log('App listening on port 3000!')
});