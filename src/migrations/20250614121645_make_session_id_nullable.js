const tableName = "user_items";

export function up(knex) {
  return knex.schema.alterTable(tableName, (table) => {

    table.integer("session_id").nullable().alter();
  });
}

export function down(knex) {
  return knex.schema.alterTable(tableName, (table) => {
    table.integer("session_id").notNullable().alter();
  });
}