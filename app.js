'use strict';
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const cors = require('cors');

//routes
//const alumniRoutes = require('./api/routes/teachers');
//const professionalRoutes = require('./api/routes/professionals');
//const emailRoutes = require('./api/routes/emails');
const userRoutes = require('./api/routes/users');
const siteRoutes = require('./api/routes/tourism');

//const feedbackRoutes = require('./api/routes/feedback');


mongoose.connect(

  //"mongodb://202.1.39.189/eboard"
  mongodbUri = "mongodb://apec:apec@nictc-sp1.chervicontraining.com/APEC
  );


const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use('/uploads', express.static('uploads')); //added sly
//app.use('/tourismImages', express.static('tourism')); //added sly
//app.use('/stationery', express.static('stationery')); //added sly
//app.use('/notices', express.static('notices')); //added sly
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));



app.use(function (req, res, next) {
 // res.header('Access-Control-Allow-Origin',  'http://202.1.39.151:4200','http://202.1.39.151:3000/notices');
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
  next();
});


//app.use('/teachers', alumniRoutes);
//app.use('/feedbacks', feedbackRoutes);
//app.use('/emails', emailRoutes);
app.use('/users', userRoutes);
//app.use('/professionals', professionalRoutes);
app.use('/tourism', siteRoutes);
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: { message: error.message }
  });
});


module.exports = app;

