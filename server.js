const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const path = require('path');
const handlebars = require('handlebars');

const mongoose   = require('mongoose');
mongoose.connect('mongodb://user:user@ds151927.mlab.com:51927/inbrain-quiz');

const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://user:user@ds151927.mlab.com:51927/inbrain-quiz', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 8080, () => {
    console.log('listening on 8080')
  })
});


app.use(bodyParser.urlencoded({extended: true}))
app.use('/', express.static(path.join(__dirname, '/')))


app.post('/createquiz', (req, res) => {
  console.log(req.body);
  db.collection('questions').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/createquiz.html')
  })
});

app.post('/finishedquiz', (req, res) => {
  console.log(req.body);
  db.collection('finishedquiz').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
  //  res.redirect('/createquiz.html')
  })
});

app.get('/quiz', (req, res) => {
  db.collection('questions').find().toArray((err, result) => {
    if (err) return console.log(err)
  //  console.log(result);
    res.json(result)
  })
})

app.get('/results', (req, res) => {
  db.collection('finishedquiz').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.json(result)
  })
})

app.post('/date', (req, res) => {
  console.log(req.body);
  db.collection('date').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
  //  res.redirect('/createquiz.html')
  })
});

app.get('/quizdates', (req, res) => {
  db.collection('quizdates').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.json(result)
  })
})
