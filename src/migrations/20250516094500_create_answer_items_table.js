const tableName = "answer_items";
 
export function up(knex) {
    return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("question_id").unsigned().notNullable();
    table.string("answer_text").nullable();
    table.boolean("is_correct").defaultTo(false); 

    table.foreign("question_id").references("question_items.id").onDelete("CASCADE");
  });
}
 
export function down(knex) {
    return knex.schema.dropTable(tableName);
}