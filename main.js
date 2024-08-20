const http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express'); // needed to serve files
var app = express();
const devtools = require('./Devtools.js');
var dir = path.join(__dirname, 'public');

app.use(express.static(dir)); // serve static files
app.use(express.json()); // Middleware to parse JSON bodies

var silhouettes = [];
fs.readdir(dir + "/silhouettes", (err, files) => {
  // Iterate through each image file in the directory
  files.forEach(file => {

    const validFileEndings = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'];
    const baseName = file.split(".")[0];
    const ending = file.split(".")[1];
    if (validFileEndings.includes(ending)) {
      silhouettes.push(file);

      // create json for image, if not existent:
      if (!fs.existsSync(`${dir}/silhouettes/${baseName}.json`)) {
        let jsonObj = `{"imagePath":"${file}", "values":[]}`;
        fs.writeFile(`${dir}/silhouettes/${baseName}.json`, jsonObj, 'utf-8', (err) => {
          if (err)
            console.log(err);
          else {
            console.log(`File ${baseName}.json successfully created.`);
          }})
      }
    }

  });
  silhouettes = devtools.shuffle(silhouettes);
  console.log("silhouettes:", silhouettes);
});

// send data to client:
app.get('/silhouettes', (req, res) => {
  res.json(silhouettes);
})

// receive data from client:
app.post('/upload', (req, res) => {
  // The JSON data sent by the client is available in req.body
  const jsonData = req.body;
  console.log(jsonData);

  // Convert JSON object to string
  const jsonString = JSON.stringify(jsonData, null, 2);
  const jsonFilePath = `${dir}/silhouettes/${jsonData.imagePath.split('.')[0]}.json`;
  // Write JSON string to a file
  fs.writeFile(jsonFilePath, jsonString, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.status(500).send('Error writing file');
    } else {
      console.log(`${jsonFilePath} has been updated`);
      res.status(200).send(`${jsonFilePath} has been updated`);
    }
  });
});
const hostname = '127.0.0.1';
const port = 3333;

app.listen(port, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});