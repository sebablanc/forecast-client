const express = require('express');
const request = require('request');
const http    = require('http');
const API = '91c7547821a8de367ab8da906df872bf';
const LAT_LONG_API = '386dd6ce1d264600874c58cbb85542d6'
// Creando app express;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res)=>{
    res.status(200).send(
        '<h1>Bienvenido a tu api de pronóstico</h1>'
    )
});

app.get('/countries/all', (req, res)=>{
    console.log('/countries/all - Pidiendo todos los países - start');
    request(`https://restcountries.eu/rest/v2/all`,(err, response, body)=>{
        if(err){
            console.log('/countries/all - Pidiendo todos los países - error: '+err);
            res.status(200).send({exito: false, message: 'Ocurrió un error al intentar obtener los países', countries: [] , length: 0});
        } else {
            resp = JSON.parse(body);
            let toReturn = [];
            resp.forEach(pais =>{
                toReturn.push({name: pais.translations.es ? pais.translations.es : pais.name});
            });
            res.status(200).send({exito: true, message: 'Países obtenidos', countries:toReturn, length: toReturn.length});
            console.log('/countries/all - Pidiendo todos los países - se devolvió el listado al cliente');
        }
        console.log('/countries/all - Pidiendo todos los países - end');
    })
});

app.post('/cities/byCountry', (req, res)=>{
    console.log('/cities/byCountry - Pidiendo ciudades por país - start');
    let pais = req && req.body ? req.body.pais : null;
    console.log('/cities/byCountry - Pidiendo ciudades por país - Verificando que se haya enviado un país');
    if(!pais) {
        res.status(200).send({exito: false, message: 'Debe proporcionar un país', ciudades: [] , length: 0});
        console.log('/cities/byCountry - Pidiendo ciudades por país - end');
        return;
    }
    
    console.log('/cities/byCountry - Pidiendo ciudades por país - llamando api ciudades con pais: '+pais);
    request.post('https://countriesnow.space/api/v0.1/countries/cities', {form:{'country': pais}},(err, response, body)=>{
        if(err){
            console.log('/cities/byCountry - Pidiendo ciudades por país - error: '+err);
            res.status(200).send({exito: false, message: 'Ocurrió un error al intentar obtener las ciudades según el dato enviado', ciudades: [] , length: 0});
        } else {
            res.status(200).send({exito: true, message: 'Países obtenidos', ciudades: JSON.parse(body), length: JSON.parse(body).length});
            console.log('/cities/byCountry - Pidiendo ciudades por país - se devolvió el listado al cliente');
        }
        console.log('/cities/byCountry - Pidiendo ciudades por país - end');
    })
});

app.get('/cities/longLat', (req, res)=>{
    console.log('/longLat - Pidiendo longitud y latitud de ciudad - start');
    let city = req && req.query ? req.query.city : null;
   
    console.log('/longLat - Pidiendo longitud y latitud de ciudad - Verificando que se haya enviado una ciudad');
    if(!city) {
        res.status(400).send({exito: false, message: 'Debe proporcionar una ciudad.', pronostico: [] , length: 0});
        console.log('/longLat - Pidiendo longitud y latitud de ciudad - end');
        return;
    }
    city = city.replace(/ /g,"%20").replace(/á/g,"a").replace(/é/g,"e").replace(/í/g,"i").replace(/ó/g,"o").replace(/ú/g,"u");

    console.log('/longLat - Pidiendo longitud y latitud de ciudad - llamando api geocoder con ciudad'+city);
    request.get(`https://api.opencagedata.com/geocode/v1/json?key=${LAT_LONG_API}&q=${city}`,(err, response, body)=>{
        if(err){
            console.log('/longLat - Pidiendo longitud y latitud de ciudad - error: '+err);
            res.status(200).send({exito: false, message: 'Ocurrió un error al intentar obtener los países según el dato enviado', latLong: [] , length: 0});
        } else {
            res.status(200).send({exito: true, message: 'Países obtenidos', latLong:(JSON.parse(body)).results[0].geometry, length: JSON.parse(body).length});
            console.log('/longLat - Pidiendo longitud y latitud de ciudad - se devolvió el listado al cliente');
        }
        console.log('/longLat - Pidiendo longitud y latitud de ciudad - end');
    });
});


app.get('/pronostico/getWeather', (req, res)=>{
    console.log('/getWeather - Pidiendo pronóstico por ciudad - start');
    console.log(req.query);
    let lat = req && req.query ? req.query.lat : null;
    let lng = req && req.query ? req.query.lng : null;

    console.log('/getWeather - Pidiendo pronóstico por ciudad - Verificando que se haya enviado una ciudad');
    if(!lat || !lng) {
        res.status(400).send({exito: false, message: 'Debe proporcionar una ciudad.', pronostico: [] , length: 0});
        console.log('/getWeather - Pidiendo pronóstico por ciudad - end');
        return;
    }
    console.log('/getWeather - Pidiendo pronóstico por ciudad - llamando api del tiempo con lat: '+lat+' y long: '+lng);
    request(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,alerts&units=metric&lang=sp&appid=${API}`,(err, response, body)=>{
        if(err){
            console.log('/getWeather - Pidiendo pronóstico por ciudad - error '+err);
            res.status(200).send({exito: false, message: 'Ocurrió un error al intentar obtener los países según el dato enviado', pronostico: [] , length: 0});
        } else {
            res.status(200).send({exito: true, message: 'Países obtenidos', pronostico:JSON.parse(body), length: JSON.parse(body).length});
            console.log('/getWeather - Pidiendo pronóstico por ciudad - se devolvió el listado al cliente');
        }
        console.log('/getWeather - Pidiendo pronóstico por ciudad - end');
    });
});

// seteando puerto
const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

//creando server
const server = http.createServer(app);
server.listen(port);

// exponiendo la app
module.exports = app;