const tableName = "question_items";
 
export function up(knex) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments("id").primary();
        table.string("question").notNullable();
        table.boolean("completed").defaultTo(false);
    });
}
 
export function down(knex) {
    return knex.schema.dropTable(tableName);
}