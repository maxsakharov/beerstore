var http = require('http');

/**
 * randomly poll beer endpoint
 */

var options = {
    hostname: 'beerstore',      // here we use internal service DNS name
    port: 80,
    path: '/beer/favourites',
    method: 'GET'
};

/**
 * look at beers
 */
function getBeers() {
    poll(options, getBeers);
}

/**
 * sip first beer
 */
function sipBeer1() {
    var opts = JSON.parse(JSON.stringify(options));
    opts.path = '/beer/sip/1';
    poll(opts, sipBeer1);
}

/**
 * sip second beer
 */
function sipBeer2() {
    var opts = JSON.parse(JSON.stringify(options));
    opts.path = '/beer/sip/2';
    poll(opts, sipBeer2);
}

function poll(opts, runNext) {
    http.request(opts, (res) => {
        console.log("Succussful " + opts.method + " of " + opts.path);
    }).on('error', (err) =>
        console.log(err)
    ).end();
    setTimeout(() => runNext(), getRandom());
}

function getRandom() {
    var max = 10000;
    var min = 400;
    return Math.random() * (max - min) + min;
}

getBeers();
sipBeer1();
sipBeer2();
