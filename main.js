const http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express'); // needed to serve files
var app = express();

var dir = path.join(__dirname, 'public');

app.use(express.static(dir)); // serve static files

const silhouettes = [];
fs.readdir(dir + "/silhouettes", (err, files) => {
  // Iterate through each image file in the directory
  files.forEach(file => {
    
    const ending = file.split(".")[1];
    if (ending == 'json') {
      silhouettes.push(file); // Store the json in the list
    }
    
    // Check if both image and .json exist in the directory:
    /*
      const validFileEndings = ['jpg', 'png'];
      const baseName = file.split(".")[0];
        const ending = file.split(".")[1];
        if (validFileEndings.includes(ending) && fs.existsSync(`${dir}/silhouettes/${baseName}.json`)) {
            silhouettes.push(`${baseName}.json`); // Store the json in the list
        }
        */
    });
    console.log("silhouettes:", silhouettes);
  });
  app.get('/silhouettes', (req, res) => {
    res.json(silhouettes);
  })

const hostname = '127.0.0.1';
const port = 3333;

app.listen(port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});