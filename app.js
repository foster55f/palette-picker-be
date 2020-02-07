const express = require('express');
const cors = require('cors');
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

//get endpoint for all projects - Foster

//get endpoint for all palettes given a specific project - Foster

//get endpoint for one project - Foster

//get endpoint for one palette on one project - Foster

//post endpoint for a project 
app.post('/api/v1/projects', async (request,response) => {
  const project = request.body;

  for (let requiredParameter of ['title']) {
    if (!project.hasOwnProperty(requiredParameter)) {
      return response 
        .status(422)
        .send({ error: `The expected format is { title: <String> }. You're missing a ${requiredParameter} property.`})
    }
  }

  try {
    const id = await database('projects').insert(project, 'id');
    response.status(201).json({ id })
  } catch (error) {
    response.status(500).json({ error })
  }
})

//post endpoint for a palette

app.post('/api/v1/projects/:id/palettes', async (request,response) => {
  const palette = request.body;
  const { id } = request.params;

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette.hasOwnProperty(requiredParameter)) {
      return response 
        .status(422)
        .send({ error: `The expected format is { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }. You're missing a ${requiredParameter} property.`})
    }
  }

  try {
    const id = await database('palettes').insert(palette, 'id');
    response.status(201).json({ id })
  } catch (error) {
    response.status(500).json({ error })
  }
})

//put endpoint to update a project name

//put endpoint to update a palette name

//delete endpoint for a project

//delete endpoint for a palette

module.exports = app;