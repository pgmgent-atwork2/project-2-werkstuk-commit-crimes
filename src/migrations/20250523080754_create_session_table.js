const tableName = "session";
 
export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("quiz_id").unsigned().notNullable();
    table.string("attempt_number").notNullable();
    table.integer("score").unsigned().notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.foreign("quiz_id").references("quiz_items.id").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}