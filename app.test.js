import "@babel/polyfill";
import request from 'supertest'
import app from './app'

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment]; 
const database = require('knex')(configuration);

describe ('Server', () => {
  beforeEach(async() => {
    await database.seed.run()
  })

  describe('init', () => {
    it('should return a 200 status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    })
  })

  describe('GET /api/v1/projects', () => {
    it('should return a 200 and all of the projects', async () => {
      const expectedProjects = await database('projects').select()
      const cleanedProjects = JSON.parse(JSON.stringify(expectedProjects))
      const res = await request(app).get('/api/v1/projects')
      const projects = res.body
  
      expect(res.status).toBe(200)
      expect(projects).toEqual(cleanedProjects)
    })
  })

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return a 200 and all of the palettes', async () => {
      const project = await database('projects').first();
      const id = project.id;
      const expectedPalettes = await database('palettes').where('project_id', id);
      const cleanedPalettes = JSON.parse(JSON.stringify(expectedPalettes))
      const res = await request(app).get(`/api/v1/projects/${id}/palettes`)
      const palettes = res.body
      console.log(palettes)
      expect(res.status).toBe(200)
      expect(palettes).toEqual(cleanedPalettes[0])
    })

    it('should return an error if there is no matching project', async () => {
      const id = -999999;
      const expectedPalettes = await database('palettes').where('project_id', id);
      const res = await request(app).get(`/api/v1/projects/${id}/palettes`);
      const palettes = res.body;
  
      expect(res.status).toBe(404)
    })
  })

  describe('GET /api/v1/projects/:id', () => {
    it('should return a project given a specific id' , async () => {
      const project = await database('projects').first();
      const id = project.id;
      const response = await request(app).get(`/api/v1/projects/${id}`);
      const returnedProjectId = response.body.id;

      expect(response.status).toBe(200);
      expect(returnedProjectId).toEqual(project.id)
    })
    it('should return an error if no project can be found with that id', async() => {
      const id = -283402;
      const response = await request(app).get(`/api/v1/projects/${id}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({error:`no project found with ${id} found`});
    })
  })

  describe('GET /api/v1/projects/:id/palettes/:id', () => {
    it('should return a palette given a specific id', async () => {
      const palette = await database('palettes').first();
      const projectId = palette.project_id;
      const paletteId = palette.id;
      const response = await request(app).get(`/api/v1/projects/${projectId}/palettes/${paletteId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(palette.name);
    })
  })

  describe('POST /api/v1/projects', () => {
    it('should post a new project to the database', async () => {
      const newProject = { id: 1, title: 'Big Pumpkin' };
      const response = await request(app).post('/api/v1/projects').send(newProject)
      const projects = await database('projects').where('id', response.body.id[0]);
      const project = projects[0];

      expect(response.status).toBe(201);
      expect(project.title).toEqual(newProject.title)
    })
  })

  it('should return an error if the incorrect parameters are provided', async () => {
    const newProject = { };
    const response = await request(app).post('/api/v1/projects').send(newProject);
    
    expect(response.status).toBe(422);
    expect(response.body).toEqual({ error: `The expected format is { title: <String> }. You're missing a title property.`})
  });

  describe('POST /api/v1/projects/:id/palettes', () => {
    it('should post a new palette to the database', async () => {
      const project = await database('projects').first();
      const { id } = project.id;
      const newPalette = { id: 1, name: 'Ah-ranges',  color1: '#000000', color2: '#000000', color3: '#000000', color4: '#000000', color5: '#000000', project_id: id };
      const response = await request(app).post(`/api/v1/projects/${id}/palettes`).send(newPalette);
      const palettes = await database('palettes').where('id', response.body.id[0]);
      const palette = palettes[0];

      expect(response.status).toBe(201);
      expect(palette.name).toEqual(newPalette.name)
    })
  })

  it('should return an error if the incorrect parameters are provided', async () => {
    const newPalette = { name: 'Brown Eyed Girl', color1: '#000000', color2: '#000000', color3: '#000000', color4: '#000000' };
    const response = await request(app).post('/api/v1/projects/:id/palettes').send(newPalette);
    
    expect(response.status).toBe(422);
    expect(response.body).toEqual({ error: `The expected format is { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }. You're missing a color5 property.`})
  })

  describe('PATCH /api/v1/projects/:id', () => {
    it('should update the name of a project in the database', async () => {
      const newTitle = {title: 'Small Pumpkin'};
      const project = await database('projects').first();
      const { id } = project;
      const response = await request(app).patch(`/api/v1/projects/${id}`).send(newTitle);
      const updatedProject = await database('projects').where('id', id);

      expect(response.status).toBe(201);
      expect(response.body.title[0].title).toEqual(newTitle.title);
      expect(updatedProject[0].title).toEqual(newTitle.title);
    })

    it('should return an error if the project is not found', async () => {
      const newTitle = {title: 'Small Pumpkin'};
      const project = await database('projects').first();
      const { id } = project;
      const response = await request(app).patch('/api/v1/projects/9999999').send(newTitle);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({error: 'Project not found.  Please try again.'})
    })
  });

  describe('PATCH /api/v1/projects/:id/palettes/:id', () => {
    it('should update the name of a palette in the database', async () => {
      const newPaletteName = {name: 'Small Pumpkin Palette'};
      const project = await database('projects').first();
      const projectId = project.id;
      const palette = await database('palettes').where('project_id', projectId);
      const paletteId = palette[0].id;
      const response = await request(app).patch(`/api/v1/projects/${projectId}/palettes/${paletteId}`).send(newPaletteName);
      const updatedPalette = await database('palettes').where('id', paletteId);
      
      expect(response.status).toBe(201);
      expect(response.body.name[0].name).toEqual(newPaletteName.name);
      expect(updatedPalette[0].name).toEqual(newPaletteName.name);
    })

    it('should return an error if the palette is not found', async () => {
      const newName = {name: 'Small Pumpkin'};
      const palette = await database('palettes').first();
      const id = palette.id;
      const response = await request(app).patch('/api/v1/projects/9999999').send(newName);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({error: 'Project not found.  Please try again.'})
    })
  })

  describe('DELETE /api/v1/projects/:id', () => {
    it('should delete a project given a specific id number', async () => {
      const project = await database('projects').first();
      const id = project.id;
      const response = await request(app).delete(`/api/v1/projects/${id}`).send(`${id}`);
      const noProject = await database('projects').where('id', id);

      expect(response.status).toBe(204);
      expect(noProject.length).toEqual(0);
    })

    it('should give an error message when the project cannot be found', async () => {
      const project = await database('projects').first();
      const id = -5;
      const response = await request(app).delete(`/api/v1/projects/${id}`).send(`${id}`);

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: `Could not find project ${id}. Please try again.`})
    })
  })

  describe('DELETE /api/v1/projects/:id/palettes/:id', () => {
    it('should delete a palette given a specific id number', async () => {
      const project = await database('projects').first();
      const projectId = project.id;
      const palette = await database('palettes').first();
      const paletteId = palette.id;
      const response = await request(app).delete(`/api/v1/projects/${projectId}/palettes/${paletteId}`).send(`${paletteId}`);
      const noPalette = await database('palettes').where('id', paletteId);

      expect(response.status).toBe(204);
      expect(noPalette.length).toEqual(0);
    })

    it('should return an error message if the palette id cannot be found', async () => {
      const project = await database('projects').first();
      const projectId = project.id;
      const palette = await database('palettes').first();
      const id = -11111;
      const response = await request(app).delete(`/api/v1/projects/${projectId}/palettes/${id}`).send(`${id}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: `Could not find palette ${id}. Please try again.`});
    })
  })
})