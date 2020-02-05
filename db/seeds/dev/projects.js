const projectsData = require('../../../projectsData')


const createProject = async (knex, project) => {

  const projectId = await knex('projects').insert({
    title: project.title,
  }, 'id');

  let palettePromises = project.palettes.map(palette => {
    return createPalette(knex, {
      project_id: projectId[0],
      name: palette.name,
      color1: palette.color1,
      color2: palette.color2,
      color3: palette.color3,
      color4: palette.color4,
      color5: palette.color5,
    });
  });

  return Promise.all(palettePromises);
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
};

exports.seed = async (knex) => {
  try {
    await knex('palettes').del() // delete all palettes first
    await knex('projects').del() // delete all projects


    let projectPromises = projectsData.map(project => {
      return createProject(knex, project);
    });

    return Promise.all(projectPromises);
  } catch (error) {
    console.log(`Error seeding data: ${error}`)
  }
};
