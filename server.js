const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

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
  console.log(req);
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

var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
//  authorize(JSON.parse(content), listEvents);
});

function authorize(credentials, callback) {
  var clientSecret = "-Fd7Q454djK-MNzL0keYtpiM"//credentials.installed.client_secret;
  var clientId = "527048710842-snkbhln5gpao5deopicjhahlh2i3icd4.apps.googleusercontent.com"//credentials.installed.client_id;
  var redirectUrl = "https://inbrain.herokuapp.com/calendar.html"
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
      }
    });
  }

  function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

app.post('/addtoGoogle', (req, res) => {
  var clientSecret = "-Fd7Q454djK-MNzL0keYtpiM"//credentials.installed.client_secret;
  var clientId = "527048710842-snkbhln5gpao5deopicjhahlh2i3icd4.apps.googleusercontent.com"//credentials.installed.client_id;
  var redirectUrl = "https://inbrain.herokuapp.com/calendar.html"
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  var calendar = google.calendar('v3');
  calendar.events.insert({
    //auth: auth,
    calendarId: 'primary',
    resource: req.body,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', req.body.htmlLink);
  });
})
