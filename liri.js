
var inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var request = require('request');
var dotenv = require('dotenv');
dotenv.config()
var moment = require("moment");
var chalk = require("chalk");
var fs = require("fs");

var divider =
"\n------------------------------------------------------------\n\n";

 


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

    var movietitle = JSON.stringify(userinput.QueryParam)
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
    var logdata = `${userinput.Name} searched for: ${mymovies.Title} Rated: ${mymovies.Rated} Starring: ${mymovies.Actors} Released: ${mymovies.Released}`

    fs.appendFile("log.txt", logdata + divider, function(err) {
        if (err) throw err;
      }); 

    
})})};

if (process.argv[2] === "spotify-this-song") {
    
        
    var promptsong = function() {
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
                    var logdata = `${userinput.Name} Searched for:${songname} By: ${songartist} Album: ${songalbum}`
                    var divider =
                    "\n------------------------------------------------------------\n\n";
                   
                    fs.appendFile("log.txt", logdata + divider, function(err) {
                        if (err) throw err;
                      }); 
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

    })}

    promptsong();
};


if (process.argv[2] === "concert-this") {

var promptconcert = function() {
    inquirer.prompt([
        {
            type: "input",
            name: "Name",
            message: "Please enter your name"
        },
        {
            type: "input",
            name: "QueryParam",
            message: "Please enter the artist you want to look up"
        }
        
        
        ]).then(function (userinput) {
            var artistquery = userinput.QueryParam.replace(" ", "%20")

            var URL = `https://rest.bandsintown.com/artists/${artistquery}/events?app_id=7bbb8d11c0827edee4d3e6fed11a78ef`;

            request(URL, function(err, response, data) {
                if (err) {
                    console.log(`ERROR: ${err} Response Code: ${response}`)
                } else{
                    var jsondata = JSON.parse(data);
                        if (jsondata.length === 0) {
                            var errdata = `${userinput.Name} searched for: ${userinput} but gor an error <${response}>`
                            console.log("Whoops, looks like this artist has no upcoming shows, try looking up someone else!")
                            fs.appendFile("log.txt", errdata + divider, function(err) {
                                if (err) throw err;
                            });
                            promptconcert();
                        } else {
                            for (i=0; i<jsondata.length; i++) {
                            var thisconcert = jsondata[i]

                            var newconcert = 
                            `
                            Venue: ${chalk.red(thisconcert.venue.name)}
                            City, State: ${chalk.red(thisconcert.venue.city)}, ${chalk.red(thisconcert.venue.region)}
                            Country: ${chalk.red(thisconcert.venue.country)}
                            Time: ${chalk.red(thisconcert.datetime)}
                            `;

                            console.log(newconcert);
                                if (thisconcert.offers.length > 0) {
                                    console.log(`Buy Tickets Here: ${chalk.cyan(thisconcert.offers[0].url)}`);
                                } else {
                                    console.log(`ERROR: ${chalk.cyan("The url to purchase tickets is currently unavailible")}`);
                                }
                        
                        }
                        }
                }


            });


        })};

        promptconcert()
    }


