"use strict";

require("dotenv").config();
const express = require("express");
const server = express();

//const PORT = 5000;
const PORT = process.env.PORT || 5000;

const cors = require("cors");

const superAgent = require("superagent");
server.use(cors());

const pg = require('pg')
const client = new pg.Client( {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized : false
  }
});
//ROUTES

server.get("/", homeRouteHandler);
server.get("/location", locationRouteHandler);
server.get("/weather", weatherRouteHandler);
server.get("/parks", parksRouteHandler);
server.get("*", notFoundHandler);

//ROUTES HANDLERS

function homeRouteHandler(req, res) {
  res.send("I AM IN MY HOME ROUTE");
}

function locationRouteHandler(req, res) {
  console.log(req.query);

  let cityName = req.query.city;
  console.log(cityName);

  let key = process.env.GEOCODE_API_KEY;
  let LocURL = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;

  let SQL = 'SELECT DISTINCT * FROM locations WHERE search_query=$1';

  let safeValues = [cityName];

  client.query( SQL, safeValues )
  .then( result => {
    if ( result.rowCount > 0 ) {
      res.send( result.rows[0] );
    }
   
    else if ( result.rowCount <= 0 ) {
      superagent.get( LocURL )
        .then( LocData => {
        let data = LocData.body;
        let cityLocation = new location( cityName, data );
        let search_query = cityName;
        let formatted_query = location.formatted_query;
        let latitude = location.latitude;
        let longitude = location.longitude;
        res.send( cityLocation );

        let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4) RETURNING *;';
        let safeValues = [search_query, formatted_query, latitude, longitude];
        client.query( SQL, safeValues );
      } )
          .catch( error => {
            res.send( error );
          } ) ;
    }
  } );
  // MY PREVIOUS PART OF LAB07

  // superAgent.get(LocURL).then((LocData) => {
  //   let data = LocData.body;

  //   let cityLocation = new location(data);
  //   console.log(cityLocation);

  //   res.send(cityLocation);
  // });
}

function weatherRouteHandler(req, res) {
  console.log(req.query);

  let cityName = req.query.search_query;
 console.log(cityName);

  let key = process.env.WEATHER_API_KEY;
  let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${key}`;

  superAgent.get(weatherURL).then((weatherData) => {
    let data = weatherData.body.data.map((val) => {
      return new weatherForecast(val);
    });
    res.send(data);
  });
}


function parksRouteHandler(req, res) {
  console.log(req.query);
  let cityName = req.query.search_query;
  console.log(cityName);

  let key = process.env.PARKS_API_KEY;

  let parkURL = `https://developer.nps.gov/api/v1/parks?q=${cityName}&api_key=${key}`;

  superAgent.get(parkURL).then((parkData) => {
    let data = parkData.body.data.map((val) => {
      return new Parks(val);
    });
    res.send(data);
  });
}

function notFoundHandler(req, res) {
  let errorObject = {
    status: 500,
    responseText: "Sorry, something went wrong",
  };
  res.status(500).send(errorObject);
}

//CONSTRUCTORS

function location(LData) {
  let search = LData[0].display_name.split(",");

  this.search_query = search[0];

  this.formatted_query = LData[0].display_name;

  this.latitude = LData[0].lat;

  this.longitude = LData[0].lon;
}

function weatherForecast(WData) {
  this.forecast = WData.weather.description;
  this.time = WData.datetime;
}
function Parks(PData) {
  this.name = PData.fullName;
  this.address = `${PData.addresses[0].line1}, ${PData.addresses[0].city}, ${PData.addresses[0].stateCode} ${PData.addresses[0].postalCode}`;
  this.fee = PData.entranceFees[0].cost;
  this.description = PData.description;
  this.url = PData.url;
}

client.connect()
 .then (()=>{
server.listen(PORT,()=>{
console,log (`listening on PORT ${PORT}`)
})

 });
