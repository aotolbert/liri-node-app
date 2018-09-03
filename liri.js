
var inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var request = require('request');
var dotenv = require('dotenv');
dotenv.config()
var moment = require("moment");
var chalk = require("chalk");


 
var spotify = new Spotify({
  id: "5968c001824a4a989de3c1c49ca1ac3c",
  secret: "2467ad067dc748ff80f2f14c3a988d48"
});

if (process.argv[2] != "movie-this" && process.argv[2] != "spotify-this-song" && process.argv[2] != "concert-this" && process.argv[2] != "do-what-it-says") {
    console.log("ERROR")
}

if (process.argv[2] === "movie-this") {

 inquirer.prompt([
{
    type: "input",
    name: "Name",
    message: "Please enter your name"
},
{
    type: "input",
    name: "QueryParam",
    message: "Please enter the movie you want to look up"
}


]).then(function (userinput) {
    var results = userinput
    console.log(results)
    console.log(results.Name)
    var movietitle = JSON.stringify(results.QueryParam)
    movietitle = movietitle.replace(" ", "+");
    console.log("Movie Title Query: " + movietitle);
    request(`http://www.omdbapi.com/?t=${movietitle}&y=&plot=short&limit=10&apikey=31c53d9`, function (error, response, body) {
    if (error != null) {
    console.log('error:', error); // Print the error if one occurred
    }
    console.log(chalk.red(JSON.parse(body).Title));

    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    console.log(JSON.parse(body));
})})};

if (process.argv[2] === "spotify-this-song") {
inquirer.prompt([
{
    type: "input",
    name: "Name",
    message: "Please enter your name"
},
{
    type: "input",
    name: "song",
    message: "What song would you like to look up?"
}
]).then(function (userinput) {
    var querysong = JSON.stringify(userinput.song);
    querysong = querysong.replace(" ", "+");
    console.log(querysong);
    var spotify = new Spotify({
        id: "5968c001824a4a989de3c1c49ca1ac3c",
        secret: "2467ad067dc748ff80f2f14c3a988d48"
      });
      spotify.search({ type: 'track', query: `${querysong}` }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(data.tracks.items); 
      });

})





};


