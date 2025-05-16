const tableName = "question_items";
 
export function up(knex) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments("id").primary();
        table.string("question").notNullable();
        table.string("image_path").nullable();
    });
}
 
export function down(knex) {
    return knex.schema.dropTable(tableName);
}