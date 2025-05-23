const tableName = "session_answer_items";
 
export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("attempt_id").unsigned().notNullable();
    table.integer("question_id").unsigned().notNullable();
    table.integer("answer_id").unsigned().notNullable();

    table.foreign("attempt_id").references("session.id").onDelete("CASCADE");
    table.foreign("question_id").references("question_items.id").onDelete("CASCADE");
    table.foreign("answer_id").references("answer_items.id").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}