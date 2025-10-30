import env from "#config/env/env.js";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    const ids = env.GSHEETS_IDS.split(',').map((s) => s.trim()).filter(Boolean);

    for (const spreadsheet_id of ids) {
        await knex('spreadsheets')
            .insert({ spreadsheet_id })
            .onConflict('spreadsheet_id')
            .ignore();
    }
}
