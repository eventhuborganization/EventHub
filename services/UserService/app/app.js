const express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Event = require('./src/models/model');

const app = express();
const port = 3000;
mongoose.connect('mongodb://mymongo/event-hub-db', { useNewUrlParser: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./src/routes/routes');
routes(app); 

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});
  
app.listen(port, () => console.log(`Event service now listening on port ${port}!`));
