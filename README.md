# flixter
Flixter is a movie database powered by The Movie Database (TMDB) API.


### Features
- login/register in the application.
- mailer, sends email when user registers.
- view all the upcoming, new releases and top rated movies.
- click on a movie to get its further details and more movie recommendations of its genre.
- play movie trailer.
- browse movies by genre.
- search movie by keywords.

### Prerequisites
- Node.js ( [download](https://nodejs.org/en/download/) )
- Mongodb ( [download](https://www.mongodb.com/download-center/community) )

### Walkthrough
  
<img src="https://github.com/skathuria29/flixter/blob/master/login.gif">
<br />
<img src="https://github.com/skathuria29/flixter/blob/master/browse.gif">
<br />
<img src="https://github.com/skathuria29/flixter/blob/master/movie-info.gif">
<br />
<img src="https://github.com/skathuria29/flixter/blob/master/genre-search.gif">


### Usage
With [npm](https://npmjs.org/) and node.js installed with mongodb running
```
  $ git clone https://github.com/skathuria29/flixter.git
  $ npm install
  $ npm start
 ```
 
 *<b>Note</b> - at the application folder level, add a folder config- add file settings.js *<br /> 
  <b>*.config/settings.js*</b> <br />
  *USERNAME and PASSWORD - through which the emails will be sent*
  
  ```
  module.exports = {
    "apiKey" : "<insert TMDB api-key>",
    "base_uri" : "https://api.themoviedb.org",
    "USERNAME" : "<insert email-id>", 
    "PASSWORD" : "<insert email-password>",
    "APPNAME" : 'Flixter',
    "PORT" : 5555
  }
  
  ```
 
