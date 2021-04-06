"use strict";

const express = require("express");

require("dotenv").config();

const server = express();

//const PORT = 5000;
const PORT = process.env.PORT || 3000;

const cors = require("cors");

server.use(cors());

const superAgent = require('superagent');


//ROUTES

server.get("/", homeRouteHandler);
server.get("/location", locationRouteHandler);
server.get("/weather", weatherRouteHandler);
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
  let LocURL = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`
  superAgent.get(LocURL)
  .then(LocData => {
      let data =LocData.body;

      let cityLocation = new location (cityName, data);
      console.log( cityLocation );

      res.send( cityLocation );
  });
}

function weatherRouteHandler(req, res) {
  console.log(req.query);

  let cityName = req.query.search_query;
  console.log(cityName);

  let key = process.env.WEATHER_API_KEY;
  let weatherURL= `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName},NC&key=${key}`;

  superAgent.get(weatherURL)
  .then(weatherData =>{
     data = weatherData.body;
     let result = data.weatherData.map(val =>{
      return new weatherForecast( val )

     });
     res.send(result);
  })
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

server.listen(PORT, () => {
  console.log(`I am in port ${PORT}`);
});
