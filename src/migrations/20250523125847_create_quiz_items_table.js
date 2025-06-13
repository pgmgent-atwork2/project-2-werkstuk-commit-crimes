const tableName = "quiz_items";
 
export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("group_id").unsigned().notNullable();
    table.string("language", 2).notNullable();
    table.string("title").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.foreign("group_id").references("sessions.group").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}