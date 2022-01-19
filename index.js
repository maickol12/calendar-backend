const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');
//CREAR EL SERVIDOR DE EXPRESS
const app = express();
//CORS
app.use(cors());
// BASE DE DATOS
dbConnection();

//DIRECTORIO PUBLICO
app.use( express.static('public') );

//LECTURA Y PARSEO DEL BODY
app.use( express.json() );


//RUTAS
app.use( '/api/auth', require('./routes/auth') );
app.use( '/api/events', require('./routes/events') );
 
//ESCUCHAR PETICIONES 
app.listen(process.env.PORT,() => {
    console.log('El servidor esta corriendo en el puerto '+process.env.PORT);
})