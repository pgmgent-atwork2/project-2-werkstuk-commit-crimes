const tableName = "feedback_items";
 
export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.string("feedback").notNullable();
    table.integer("rating").unsigned().notNullable();
    //might have to add rating foreign id later

    table.foreign("user_id").references("user_items.id").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}