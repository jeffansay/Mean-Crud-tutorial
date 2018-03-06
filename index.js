const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const router = express.Router();
const authentication = require('./routes/authentication')(router);
//variable
const port = 3000;


mongoose.connect(config.uri, (err) => {
  if(err){
    console.log('Could not connect to the database ' + config.uri);
  } else {
  //  console.log(config.secret);
    console.log('Connected on database ' + config.uri);
  }
});

//middleware
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/authentication', authentication);

app.use(express.static(__dirname + '/client/dist/')); //for accesing the static file

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});


app.listen(port, () => {
  console.log('Listening on port ' + port);
});
