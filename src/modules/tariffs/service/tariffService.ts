import knex from "#postgres/knex.js";

import { fetchWBTariffs } from "../api/wbApi.js";
import { normalizeTariffs } from "../model/tariffNormalizer.js";
import { upsertRegion, upsertWarehouse, upsertTariff } from "../repository/tariffRepository.js";

export async function syncWBTariffs() {
    console.log("WB tariff synchronization start");
    const wbData = await fetchWBTariffs();
    const { dtNextBox, dtTillMax, tariffs } = normalizeTariffs(wbData);
    const today = new Date().toISOString().slice(0, 10);

    await knex.transaction(async (tr) => {
        for (const t of tariffs) {
            const region = await upsertRegion(tr, t.region_name);
            const warehouse = await upsertWarehouse(tr, t.warehouse_name, region.id);
            await upsertTariff(tr, warehouse.id, today, t, { dtNextBox, dtTillMax });
        }
    });

    console.log(`Synchronization completed: ${tariffs.length} records updated`);
}
