const tableName = "session";
 
export function up(knex) {
  return knex.schema.createTable("sessions", function (table) {
    table.increments("id").primary();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable("sessions");
}