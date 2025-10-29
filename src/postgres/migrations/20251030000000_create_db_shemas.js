/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    await knex.schema.createTable("regions", (table) => {
        table.bigIncrements("id").primary();
        table.text("name").notNullable().unique();
        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("warehouses", (table) => {
        table.bigIncrements("id").primary();

        table.bigInteger("region_id").notNullable().references("id").inTable("regions");

        table.text("name").notNullable().unique();
        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("wb_tariffs_daily", (table) => {
        table.date("date").notNullable();

        table.bigInteger("warehouse_id").notNullable().references("id").inTable("warehouses");

        table.decimal("box_delivery_base").notNullable();
        table.decimal("box_delivery_coef").notNullable();
        table.decimal("box_delivery_marketplace_base").notNullable();
        table.decimal("box_delivery_marketplace_coef").notNullable();
        table.decimal("box_storage_base").notNullable();
        table.decimal("box_storage_coef").notNullable();
        table.decimal("box_delivery_liter").nullable();
        table.decimal("box_delivery_marketplace_liter").nullable();
        table.decimal("box_storage_liter").nullable();

        table.date("source_dt_next_box").nullable();
        table.date("source_dt_till_max").nullable();

        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
        table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());

        table.primary(["date", "warehouse_id"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("wb_tariffs_daily");
    await knex.schema.dropTableIfExists("warehouses");
    await knex.schema.dropTableIfExists("regions");
}
