'use strict';

const express = require ('express');

require('dotenv').config();

const server = express();

//const PORT = 5000;
const PORT = process.env.PORT || 3000;

const cors = require('cors');

server.use(cors());


//ROUTES

server.get('/location', (req,res)=>{
    //res.send('I AM IN LOCATION ROUTE')
    let locate = require('./data/location.json');
    //console.log(locate);
    let RecentLocation = new location(locate);

})

finction location(data){
    let search = data[0].display_name.split (',');
    this.search_query = search[0];
    this.formatted_query =data[0].display_name;
    this.latitude = data[0].lat;
    this.longitude = data[0].lon;
}
server.listen(PORT,() => {
    console.log(`I am in port ${PORT}`);
})