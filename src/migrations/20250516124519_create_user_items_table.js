const tableName = "user_items";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.integer("age").notNullable().unsigned();
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}