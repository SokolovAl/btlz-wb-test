import cron from "node-cron";
import knex from "#postgres/knex.js";
import { syncWBTariffs } from "./modules/tariffs/service/tariffService.js";
import { pushToAllSheets } from "#modules/sheets/exportTariffs.js";

async function main() {
    console.log("Launch");

    try {
        console.log("Using migrations");
        await knex.migrate.latest();
        console.log("Migrations applied successfully");

        console.log("Running seeds");
        await knex.seed.run();
        console.log("Seeds completed successfully");

        console.log("Initial synchronization of WB tariffs");
        await syncWBTariffs();
        console.log("Synchronization completed");

        try {
            console.log("Exporting data to Google Sheets");
            await pushToAllSheets();
            console.log("Google Sheets export completed successfully");
        } catch (err) {
            console.error("Error exporting to Google Sheets:", err);
        }

        cron.schedule("0 * * * *", async () => {
            console.log("Cron: Launch WB tariff synchronization");
            try {
                await syncWBTariffs();
                console.log("Cron: Sync completed successfully");

                console.log("Cron: Exporting to Google Sheets");
                await pushToAllSheets();
                console.log("Cron: Google Sheets export completed successfully");
            } catch (err) {
                console.error("Cron: Error syncing:", err);
            }
        });

        console.log("The cron scheduler has been launched. The service is ready to work.");
    } catch (err) {
        console.error("Error initializing application", err);
        process.exit(1);
    }
}

main();
