const http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express'); // needed to serve files
var app = express();

var dir = path.join(__dirname, 'public');

app.use(express.static(dir));

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, function () {
    console.log('Listening ...');
});

// const server = http.createServer((req, res) => {
//   fs.readFile('index.html', function(err, data)
//   {
//     res.writeHead(200, {'Content-Type' : 'text/html'});
//     res.write(data);
//     return res.end();
//   });
// //   res.statusCode = 200;
// //   res.setHeader('Content-Type', 'text/plain');
// //   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });