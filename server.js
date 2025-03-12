const express = require('express');
const path = require('path');
const app = express();

// Get the correct output path from your angular.json
const outputPath = 'dist/projeto-gerenciamento';  // Adjust this based on your angular.json

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, outputPath)));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, outputPath, 'index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
console.log('Server started on port ' + (process.env.PORT || 8080));
