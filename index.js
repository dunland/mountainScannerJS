const http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express'); // needed to serve files
var app = express();

var dir = path.join(__dirname, 'public');

app.use(express.static(dir)); // serve static files

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
