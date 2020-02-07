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

    // it('should return an error if the project is not found', async () => {
    //   const newTitle = {title: 'Small Pumpkin'};
    //   const project = await database('projects').first();
    //   const { id } = project;
    //   const response = await request(app).patch('/api/v1/projects/9999999').send(newTitle);

    //   expect(response.status).toBe(404);
    //   expect(response.body).toEqual({error: 'Project not found.  Please try again.'})
    // })
  })

})