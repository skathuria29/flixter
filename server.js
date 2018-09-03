const express = require('express');
const PORT = 3000;
const passport = require('passport');
const hbs = require('express-handlebars');
var path = require('path');

const app = express();

var routes = require('./routes/login');
var movies = require('./routes/movie');


app.engine('hbs' , hbs({ extname : 'hbs' , defaultLayout : 'layout' , layoutsDir : __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine' , 'hbs');

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));
// app.use('/movies' , movies);

// app.get('/', (rq, res) => {
//     res.send('Hello world!');
// })

app.listen(PORT, (err) =>{
    if(err)
        console.log(`PORT ${PORT} already in use`);
    else 
        console.log(`Server running on port ${PORT}`);
})