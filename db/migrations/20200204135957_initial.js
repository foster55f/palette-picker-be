
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('projects', (request, response) => {
            table.increments('id').primary();
            table.string('title');

            table.timestamps(true, true)
        }),
        
        knex.schema.createTable('palettes', (request, response) => {
            table.increments('id').primary();
            table.string('name');
            table.string('color');
            
            table.integer('paper_id').unsigned()
            table.foreign('paper_id')
                .references('papers.id');
            
            table.timestamps(true, true)
      })
  ])
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('projects')
        .dropTable('players')
};
