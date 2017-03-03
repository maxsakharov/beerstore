var Prometheus = require('prom-client');
var http = require('http');

var histoConf = { buckets: [5,10,25,50,100,300,500,750,1000,2000,5000,10000,20000,30000] };

var incomingHisto = new Prometheus.Histogram(
    'http_request_duration',
    'request duration in milliseconds histogram',
    ['method', 'path', 'status'],
    histoConf
);

var incomingGague = new Prometheus.Gauge(
    'http_request_duration_gauge',
    'request duration in milliseconds gauge',
    ['method', 'path', 'status']
);

var outgoingHisto = new Prometheus.Histogram(
    'http_outgoing_request_duration',
    'request duration in milliseconds histogram',
    ['method', 'path', 'status'],
    histoConf
);

var outgoingGague = new Prometheus.Gauge(
    'http_outgoing_request_gauge',
    'request duration in milliseconds gauge',
    ['method', 'path', 'status']
);

module.exports.middleware = function(req, res, next) {
    var start = process.hrtime();
    res.on('finish', function () {
        var elapsed = duration(start);
        pushIncomingMetric(req.method, req.path, res.statusCode, start);
    });
    next();
}

module.exports.handleUpsrream = function() {
    var original = http.request;
    http.request = function (req, callback) {
        var start = process.hrtime();
        return original(req, function (err, res) {
            var code = err ? err.statusCode : res.statusCode;
            pushOutgoingMetric(req.method, req.path, code, start);
            return callback;
        });
    }
}

module.exports.response = function(req, res) {
    res.status(200).end(Prometheus.register.metrics());
}

function pushIncomingMetric(method, path, statusCode, start) {
    var elapsed = duration(start);
    incomingHisto.labels(method, path, statusCode).observe(elapsed);
    incomingGague.labels(method, path, statusCode).set(elapsed);
}

function pushOutgoingMetric(method, path, statusCode, start) {
    var elapsed = duration(start);
    outgoingHisto.labels(method, path, statusCode).observe(elapsed);
    outgoingGague.labels(method, path, statusCode).set(elapsed);
}

function duration(start) {
    var diff = process.hrtime(start);
    return Math.round((diff[0] * 1e9 + diff[1]) / 1000000);
}