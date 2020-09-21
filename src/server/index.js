require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

//Set up API for photos and filter by Rover ID
app.get('/photos/:id', async(req, res) => {
    console.log("REQ ", req.params)
    console.log("TYPE ", typeof(req.params.id));
    let name = "";
    if(req.params.id === '5'){
        name = "curiosity";
    }
    else if(req.params.id === '6'){
        name = "opportunity";
    }
    else if(req.params.id === '7'){
        name = "spirit";
    }

    try{
        let photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`)
        .then(res => res.json())
        res.send({photos})
    }
    catch(err){
        console.log('error:', err); 
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))