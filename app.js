import express from 'express';
import cors from 'cors';
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration)

app.locals.title = 'Palette Picker';
app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker!');
});

//get endpoint for all projects 

//get endpoint for all palettes given a specific project

//get endpoint for one project

//get endpoint for one palette on one project

//post endpoint for a project

//post endpoint for a palette

//put endpoint to update a project name

//put endpoint to update a palette name

//delete endpoint for a project

//delete endpoint for a palette

export default app;