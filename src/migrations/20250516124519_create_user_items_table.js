const tableName = "user_items";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("age").notNullable().unsigned();
    table.string("name", 255).notNullable();
    table.integer("session_id").unsigned().notNullable();

    table.foreign("session_id").references("session.id").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}