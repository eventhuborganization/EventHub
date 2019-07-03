const express = require('express')
//const session = require('express-session')
var bodyParser = require('body-parser')

var mongoose = require('mongoose')
var Event = require('./src/models/eventModel')

const app = express()
const port = 3000
mongoose.connect('mongodb://localhost/dbevent', { useNewUrlParser: true, useFindAndModify: false });

//Per gestire i parametri passati nel corpo della richiesta http.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

//app.use(session({secret: '343ji43j4n3jn4jk3n'}))

var routes = require('./src/routes/eventRoutes');
routes(app); 

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});
  
app.listen(port, () => console.log(`Event service now listening on port ${port}!`))