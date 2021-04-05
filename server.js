'use strict';

const express = require ('express');

require('dotenv').config();

const cors = require('cors');

server.use(cors());

const server = express();

const PORT = process.env.PORT || 3000;

//ROUTES

server.get('/location', (req,res)=>{
    res.send('I AM DOING IT')
})

server.listen(PORT,() => {
    console.log(`I am in port ${PORT}!`);
})