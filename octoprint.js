var request = require('request');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
require('dotenv').config();

/*-----------------------------------------------
|                User defined                   |
-----------------------------------------------*/

const base = process.env.BASE_URL;
const api_key = process.env.API_KEY;
const version = '1.0';

var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 3000;

/*-----------------------------------------------
|                 PRINTER API                   |
-----------------------------------------------*/

const url = 'http://' + base;
const headers = {'x-api-key': api_key};

function get_version()
{
	var options = { 
		method: 'GET',
	  	url: url + '/api/version',
	  	headers: headers
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		var content = JSON.parse(body);
		console.log(content);
	});
}

function get_connection(callback)
{
	var options = { 
		method: 'GET',
	  	url: url + '/api/connection',
	  	headers: headers
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		var content = JSON.parse(body);
		callback(content);
	});
}

function connect(callback)
{
	var options = { 
		method: 'POST',
	  	url: url + '/api/connection',
	  	headers: headers,
  		body: {
  			command: 'connect',
	     	port: 'AUTO',
	     	baudrate: 250000,
	     	printerProfile: '_default',
	     	save: true,
	     	autoconnect: true
	     },
  		json: true 
  	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		callback(response.statusCode);
	});
}

/**
 * Callback for job_operation
 * Runs after a job_operation is sent, and displays the status code
 * @callback job_operation_callback
 * @param {number} statusCode - Status code for the job operation
 */

/**
 * Send a print job operation
 *
 * @param {string} command - What command to send (start, stop, pause)
 * @param {string} [action] - Action to perform with the command (pause, resume)
 * @param {job_operation_callback} callback - Run callback when job operation is sent
 */
function job_operation(command, action, callback)
{
	var command_payload = { command: command };
	if (action)
		command_payload.action = action;

	var options = { 
		method: 'POST',
	  	url: url + '/api/job',
	  	headers: headers,
  		body: command_payload,
  		json: true 
  	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		callback(response.statusCode);
	});
}

/**
 * Callback for bed_operation
 * Runs after a bed_operation is sent, and displays the status code
 * @callback bed_operation_callback
 * @param {number} statusCode - Status code for the job operation
 */

/**
 * Send a print job operation
 *
 * @param {number} temperature - 
 * @param {bed_operation_callback} callback - Run callback when job operation is sent
 */
function bed_operation(temperature, callback)
{
	var options = { 
		method: 'POST',
	  	url: url + '/api/printer/bed',
	  	headers: headers,
  		body: {
  			command: 'target',
  			target: temperature
  		},
  		json: true 
  	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		callback(response.statusCode);
	});
}

/**
 * Callback for job_status
 * Runs after a job_status is sent, and displays current job's status
 * @callback job_status_callback
 * @param {Object} status - Status for the current job
 */

/**
 * Get a print job status
 * @param {job_status_callback} callback - Run callback when job operation is sent
 */
function job_status(callback)
{
	var options = { 
		method: 'GET',
	  	url: url + '/api/job',
	  	headers: headers
  	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		var content = JSON.parse(body);
		callback(content);
	});
}

/*-----------------------------------------------
|                    REST API                   |
-----------------------------------------------*/

bed_operation(25, function(status) {
	console.log(status);
});

var server = http.createServer(app);

// Start the app
server.listen(port, function() {
    console.log('Server running on %s://%s:%d', 'http', 'localhost', port);
});

app.put('/temperature/:temp', function(req, res) {
	bed_operation(req.params.id, function(status) {
    	res.send(status);
	});
});

app.get('/', function(req, res) {
    res.send('Hello World');
})