var fs = require('fs');
var express = require('express');
var app = express();
var query = require('./query');
var path = require('path');
var pug = require('pug');

var bodyParser = require('body-parser');
//set port
var port = process.env.PORT || 5000
let { Client } = require('pg');
let connString;
if (process.env.DATABASE_URL){
  connString = process.env.DATABASE_URL
} else {
 // connString =  'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD;
 connString = {
   user: 'postgres',
   password: 'jannat15',
   database: 'bulletinboard',
   host: 'localhost',
   port: 5432
 }
}

var client = new Client(connString);
client.connect();

function get_all_messages(id){
              return new Promise(function(resolve, reject){
                  query('SELECT* FROM messages where id =$1', [id], function(err, results){
                   //handle the error and results as appropriate.
                   if(err){
                        reject(err);
                     }
                        resolve(results.rows);
              });
         });
     }

    // Load View Engine
     app.set('view engine', 'pug');
     app.use(express.static('assets'));
     app.use(express.static(__dirname + '/assets'));


//Home  route
app.get('/', function(request, response){

  client.query('SELECT * FROM messages', (err, res) => {
                  if (err) throw err;
                  let arr = [];
                  for (let row of res.rows) {
                    arr.push(row);
                  }
                  console.log(arr);
                  // client.end();
      response.render('index',{
                    messages: arr,
                    title: 'Here are all the messages:'
                      });

       // client.end();
                });
            });

app.get('/form', function(req, res){
  res.render('form',{
     title: 'Add :'
  });
});

app.get('/add', function(req, res){
  // console.log(req.body);
  client.query('insert into messages (title, body) values ($1, $2)', [req.query.title, req.query.body], function(err, results){
   //handle the error and results as appropriate.
             if(err){
              throw(err);
              console.log(err)
              // return done(client);
           }
   console.log('New message.');
         });
               return res.redirect('/');
       });

app.get('*', function(req, res) {
  res.status(404).send('<h1>uh oh! page not found!</h1>');
     });

var server = app.listen(3333, function(){
          console.log('Open http://localhost:3333 in the browser');
    });
