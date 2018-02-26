const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');


const app = express();

//variable
const port = 3000;

mongoose.connect(config.uri, (err) => {
  if(err){
    console.log('Could not connect to the database ' + config.db);
  } else {
  //  console.log(config.secret);
    console.log('Connected on database ' + config.db);
  }
});

//middleware
app.use(express.static(__dirname + '/client/dist/')); //for accesing the static file


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});


app.listen(port, () => {
  console.log('Listening on port ' + port);
});
