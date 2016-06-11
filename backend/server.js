var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var users = require('../data/users.json');
var transactions = require('../data/transactions.json');
var categories = require('../data/categories.json');
var labels = require('../data/labels.json');


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(bodyParser());
app.use(express.static(__dirname + '/build'));



app.route('/api/transactions')
  .get(function(req, res){
    res.send(transactions);
  })
  // Add 
  .post(function(req, res){
    transactions.data.push(req.body)
    res.send(transactions);
  })
  // Update
  .put(function(req, res){
    var body = req.body;
    function filterById(elem) {return elem.id == body.id}
    var updatedElem = transactions.data.filter(filterById)[0];
    updatedElem = _.assign(updatedElem, body);
    res.send(transactions);
  });

app.route('/api/categories')
  .get(function(req, res){
    res.send(categories);
  });

app.route('/api/users')
  .get(function(req, res){
    res.send(users);
  });

app.route('/api/labels')
  .get(function(req, res){
    res.send(labels);
  });

app.listen(9000, function () {
  console.log('Backend Ready');
});