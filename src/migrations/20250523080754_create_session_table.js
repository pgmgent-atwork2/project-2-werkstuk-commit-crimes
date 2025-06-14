const tableName = "session";
 
export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("group_id").unsigned().notNullable();
    table.boolean("second_try").defaultTo(false);
    table.integer("password").unsigned().nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.foreign("group_id").references("quiz_items.group_id").onDelete("CASCADE");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}