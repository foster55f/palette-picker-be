
exports.up = function(knex)  {
    return knex.schema
        .createTable('projects', (table) => {
            table.increments('id').primary();
            table.string('title');

            table.timestamps(true, true)
        })
        .createTable('palettes', (table) => {
            table.increments('id').primary();
            table.string('name');
            table.string('color1');
            table.string('color2');
            table.string('color3');
            table.string('color4');
            table.string('color5');

            table.integer('project_id').unsigned()
            table.foreign('project_id')
                .references('projects.id');
            
            table.timestamps(true, true)
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('palettes')
        .dropTable('projects')
};
