const tableName = "user_answers";

export function up(knex) {
  return knex.schema.createTable("user_answers", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("answer_id").unsigned().notNullable();
    table.foreign("user_id").references("user_items.id").onDelete("CASCADE");
    table.foreign("answer_id").references("answer_items.id").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}