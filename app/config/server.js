///Requerimento dos módulos
var express = require('express')
var consign = require('consign')
var bodyParser = require('body-parser')
//var expressValidator = require('express-validator')
//var mqtt = require('mqtt')
var cors = require('cors')
// var routes = require('../app/routes/routes')

var app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.json())

console.log('Configurações do server setadas!')

consign()
    .include('app/config/mongoconnection.js')
    .then('app/routes')
    .then('app/controllers')
    .into(app)

module.exports = app;