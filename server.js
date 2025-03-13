const express = require('express');
const path = require('path');
const app = express();

const outputPath = 'dist/projeto-gerenciamento';

app.use(express.static(path.join(__dirname, outputPath)));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, outputPath, 'index.html'));
});

app.listen(process.env.PORT || 8080);
console.log('Server started on port ' + (process.env.PORT || 8080));
