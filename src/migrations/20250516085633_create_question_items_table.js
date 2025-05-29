const tableName = "question_items";
 
export function up(knex) {
    return knex.schema.createTable(tableName, function (table) {
        table.increments("id").primary();
        table.integer("quiz_id").unsigned().notNullable();
        table.string("question_text").notNullable();
        table.string("image_path").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());

        table.foreign("quiz_id").references("quiz_items.id").onDelete("CASCADE");
    });
}
 
export function down(knex) {
    return knex.schema.dropTable(tableName);
}