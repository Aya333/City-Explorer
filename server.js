'use strict';

const express = require ('express');

require('dotenv').config();

const server = express();

//const PORT = 5000;
const PORT = process.env.PORT || 3000;

const cors = require('cors');

server.use(cors());


//ROUTES

//LOCATION ROUTE 
server.get('/location', (req,res)=>{
    //res.send('I AM IN LOCATION ROUTE')
    let locate = require('./data/location.json');
    //console.log(locate);
    let RecentLocation = new location(locate);
    res.send(RecentLocation);

})

function location(LData){
    let search = LData[0].display_name.split (',');

    this.search_query = search[0];

    this.formatted_query = LData[0].display_name;

    this.latitude = LData[0].lat;

    this.longitude = LData[0].lon;
}

//WEATHER ROUTE 
server.get('/weather',(req,res) => {
    let Weather = reaquire('./data/weather.json');
    let result = [];
    weatherInfo.WData.forEach( element => result.push( new weatherForecast( element ) ) );
    res.send( result );
     
})

function weatherForecast(WData){
        this.forecast = WData.weather.description;
        this.time = WData.datetime;
}

server.listen(PORT,() => {
    console.log(`I am in port ${PORT}`);
})