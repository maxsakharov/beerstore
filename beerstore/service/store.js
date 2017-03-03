var util = require('util');

var beerList = [
    {id: 1, name: "Heineken"},
    {id: 2, name: "Krombacher"},
    {id: 3, name: "Stella"}
]

module.exports.getBeer = function(req, res) {
    var beer = beerList.find((beer) => beer.name == req.params.name);
    if (beer) {
        res.send(beer).end();
    } else {
        res.status(404).end();
    }
};

module.exports.addBeer = function(req, res) {
    var name = req.body.name;
    if (!name) {
        res.status(400)
           .send({"Error": "No beer name specified"})
           .end();
    } else if (beerList.find((beer) => beer.name == name)) {
        res.status(400)
           .send({"Error": util.format("Beer with name '%s' exists", name)})
           .end();
    } else {
        beerList.push({"id": beerList.length + 1, "name": name});
        res.status(201).end();
    }
};

module.exports.sip = function(req, res) {
    var beer = beerList.find((beer) => beer.id == req.params.id)
    if (beer) {
        res.send([beer.name + ". Mmmm... Nice!"]).end();
    } else {
        res.status(404).end();
    }
}

module.exports.getBeers = function(req, res) {
    res.send(beerList).end();
};