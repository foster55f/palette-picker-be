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

})