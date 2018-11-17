var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 3000;

var server = http.createServer(app);

// Start the app
server.listen(port, function() {
    console.log('Server running on %s://%s:%d', 'http', 'localhost', port);
});

app.post('/temperature', function(req, res) {
    if ('queryResult' in req.body) {
        var parameters = req.body.queryResult.parameters;
        var element = parameters['heating-element'];
        var temp = parameters['temp'];
        console.log('Temp: ' + temp);
    }
    res.send(200);
});

app.get('/', function(req, res) {
    res.send('Hello World');
})