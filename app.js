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

app.get('/api/v1/projects', async (request, response) => {
  try {
    const projects = await database('projects').select();
    response.status(200).json(projects);
  } catch(error) {
    response.status(500).json({ error });
  }
});

app.get('/api/v1/projects/:id/palettes', async (request, response) => {
  try {
    const { id } = request.params;
    const palettes = await database('palettes').where('project_id', id);

    palettes.length ? response.status(200).json(palettes[0]) : response.status(404).json({ error: `Could not find project with id of ${id}. Please try again.`})
  } catch(error) {
    response.status(500).json({ error });
  }
});

app.get('/api/v1/projects/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const project = await database('projects').where('id', id);
  
    project.length ? response.status(200).json(project[0]) : response.status(404).json({error:`no project found with ${id} found`});
  } catch (error) {
    response.status(500).json({ error })
  }
})

app.get('/api/v1/projects/:projectId/palettes/:paletteId', async (request, response) => {
  try {
    const { paletteId } = request.params;
    const palette = await database('palettes').where('id', paletteId);
    
    palette ? response.status(200).json(palette[0]) : response.status(404).json({error:`no palette found with ${paletteId} found`})
  } catch(error) {
    response.status(500).json({error})
  }
})

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

app.patch('/api/v1/projects/:projectId', async (request, response) => {
  const newTitle = request.body.title;
  const { projectId } = request.params;
  const project = await database('projects').where('id', projectId);

  if(!project.length) {
    response.status(404).json({ error: 'Project not found.  Please try again.'})
    return
  }

  try {
    const updatedTitle = await database('projects').where('id', projectId).update({title: newTitle}, ['id', 'title']);
    response.status(201).json({ title: updatedTitle })
    return 
  } catch (error) {
    response.status(500).json({ error })
    return 
  }
})

app.patch('/api/v1/projects/:projectId/palettes/:paletteId', async (request, response) => {
  const newPaletteName = request.body.name;
  // const { projectId } = request.params;
  const { paletteId } = request.params;
  
  const palette = await database('palettes').where('id', paletteId);

  if(!palette.length) {
    response.status(404).json({ error: 'Palette not found.  Please try again.'})
  }
  try {
    const updatedName = await database('palettes').where('id', paletteId).update({name: newPaletteName}, ['id', 'name']);
    response.status(201).json({ name: updatedName })
  } catch (error) {
    response.status(500).json({ error })
  }
})


//delete endpoint for a project
app.delete('/api/v1/projects/:id', async (request, response) => {
  const id = request.params.id;
  try {
    const project = await database('projects').where('id', id);
    if (project.length) {
      await database('palettes').where('project_id', id).del();
      await database('projects').where('id', id).del();
      response.status(204).send(`Project ${id} has been successfully deleted.`)
    } else {
      response.status(404).json({ error: `Could not find project ${id}. Please try again.`})
    }
  } catch (error) {
    response.status(500).json({ error })
  }
})

//delete endpoint for a project
app.delete('/api/v1/projects/:projectId/palettes/:paletteId', async (request, response) => {
  const { paletteId } = request.params;
  
  try {
    const palette = await database('palettes').where('id', paletteId);
    if (palette.length) {
      await database('palettes').where('id', paletteId).del();
      response.status(204).send(`Palette ${paletteId} has been successfully deleted.`)
    } else {
      response.status(404).json({ error: `Could not find palette ${paletteId}. Please try again.`})
    }
  } catch (error) {
    response.status(500).json({ error })
  }
})
  


module.exports = app;