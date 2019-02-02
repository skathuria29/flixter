const express = require('express');
const PORT = 5555;
const passport = require('passport');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
const flash = require('connect-flash');
var session = require('express-session');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/moviedb');

const app = express();

var routes = require('./routes/login');
var movies = require('./routes/movie');


app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs' , hbs({ extname : 'hbs' , defaultLayout : 'layout' , layoutsDir : __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine' , 'hbs');


// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));
  

// Connect Flash
app.use(flash());

app.use('/', routes);
app.use('/home', movies);

app.listen(PORT, (err) =>{
    if(err)
        console.log(`PORT ${PORT} already in use`);
    else 
        console.log(`Server running on port ${PORT}`);
})