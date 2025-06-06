const tableName = "user_items";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.integer("age").notNullable().unsigned();
    table.string("language", 2).notNullable();
    table.integer("first_score").nullable().unsigned();
    table.integer("second_score").nullable().unsigned();
    table.integer("session_id").unsigned().unique().notNullable();

    table.foreign("session_id").references("session.id").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}