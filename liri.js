
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
    console.log(`
    ERROR you did not input a valid command.
    Valid Commands are:
    movie-this,
    spotify-this-song,
    concert-this,
    do-what-it-says`);
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
    var movietitle = JSON.stringify(results.QueryParam)
    movietitle = movietitle.replace(" ", "+");
    console.log("Movie Title Query: " + movietitle);
    request(`http://www.omdbapi.com/?t=${movietitle}&y=&plot=short&limit=10&apikey=31c53d9`, function (error, response, body) {
    if (error != null) {
    console.log('error:', error); // Print the error if one occurred
    }
    // console.log('body:', body); // Print the HTML for the Google homepage.

    var mymovies = JSON.parse(body);
    console.log(chalk.bold("Title: " + chalk.red(mymovies.Title)));
    console.log(chalk.bold("Rated: " + chalk.red(mymovies.Rated)));
    console.log(chalk.bold("Starring: " + chalk.red(mymovies.Actors)));
    console.log(chalk.bold("Released: " + chalk.red(mymovies.Released)));
    console.log(chalk.bold("IMDB Rating: " + chalk.red(mymovies.Ratings[0].Value)));
    console.log(chalk.bold("Rotten Tomatoes Rating: " + chalk.red(mymovies.Ratings[1].Value)));
    console.log(chalk.bold("Country: " + chalk.red(mymovies.Country)));
    console.log(chalk.bold("Languages: " + chalk.red(mymovies.Language)));
    console.log(chalk.bold("Summary: " + chalk.red(mymovies.Plot)));
    
    // console.log(mymovies)
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    
})})};

if (process.argv[2] === "spotify-this-song") {
    
        
    inquirer.prompt(
    {
        type: "input",
        name: "song",
        message: "What song would you like to look up?"
    }
    ).then(function (userinput) {
        var iterator = 0;
        var querysong = JSON.stringify(userinput.song);
        querysong = querysong.replace(" ", "+");
        // console.log(querysong);
        var spotify = new Spotify({
            id: "5968c001824a4a989de3c1c49ca1ac3c",
            secret: "2467ad067dc748ff80f2f14c3a988d48"
        });
        spotify.search({ type: 'track', query: `${querysong}`, limit: 5 }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            }
        var songartist  = (data.tracks.items[`${iterator}`].album.artists[`${iterator}`].name)
        var songalbum = (data.tracks.items[`${iterator}`].album.name);
        var songname = (data.tracks.items[`${iterator}`].name)
    
        console.log(chalk.bgRed("Title: " + songname));
        console.log(chalk.bgRed("By: " + songartist));
        console.log(chalk.bgRed("Album: " + songalbum));

        // console.log("Data: " + data.tracks.items[`${iterator}`].album)

        
        var nextsong = function nextsong() {
        
        inquirer.prompt(
            {
                type: "confirm",
                name: "correctsong",
                message: "Is this the song you were looking for??"
            }).then(function(isong) {
                if (isong.correctsong) {
                    console.log("Nice! Glad to hear you like that song. Its one of my favorites too!")
                    console.log(chalk.bgGreen(chalk.black("You can listen to that song here: " + chalk.bgRed(data.tracks.items[`${iterator}`].external_urls.spotify))));
                } else {
                    iterator++
                    console.log("Oh No! That must be a more current song with a similar name, how about this one?")
                    console.log(chalk.bgRed("Title: " + data.tracks.items[`${iterator}`].name));
                    console.log(chalk.bgRed("Artist: " + data.tracks.items[`${iterator}`].album.artists[0].name));
                    console.log(chalk.bgRed("Album: " + data.tracks.items[`${iterator}`].album.name));
                    nextsong();
                }

            });


            }

            nextsong();

        });

    })};


if (process.argv[2] === "concert-this") {


};

