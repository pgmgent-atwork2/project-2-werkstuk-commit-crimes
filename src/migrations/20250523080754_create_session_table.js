const tableName = "session";
 
export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.integer("group").unsigned().notNullable();
    table.boolean("second_try").defaultTo(false);
    table.integer("password").unsigned().nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.index("group");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}