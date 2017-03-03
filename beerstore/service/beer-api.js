var request = require('request');
var url = require('url');
var util = require('util');
var url = "http://api.brewerydb.com/v2/search";
var key = "485f8cb0baf89deffdde8b3af2681a92";

module.exports.description = function(req, res) {
    var name = req.query.name;
    if (!name) {
        res.status(400).send({"Error": "No beer name url params"}).end();
    } else {
        request.get(util.format("%s?key=%s&q=%s&type=beer", url, key, name),
            (err, response, body) => {
                var beer = JSON.parse(body);
                if (!beer.data) {
                    res.status(404).end();
                } else {
                    res.send({
                        "name"          : beer.data[0].name,
                        "description"   : beer.data[0].style.description,
                        "temperature"   : beer.data[0].servingTemperatureDisplay
                    }).end();
                }
        });
    }
}