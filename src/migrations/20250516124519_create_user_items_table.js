const tableName = "user_items";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("age").notNullable().unsigned();
    table.string("name", 255).notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}