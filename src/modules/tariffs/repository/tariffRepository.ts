import type { Knex } from "knex";
import type { NormalizedTariff } from "../model/tariffNormalizer.js";

export async function upsertRegion(tr: Knex.Transaction, name: string) {
    const [inserted] = await tr("regions").insert({ name }).onConflict("name").ignore().returning("*");

    return inserted ?? (await tr("regions").where({ name }).first());
}

export async function upsertWarehouse(tr: Knex.Transaction, name: string, regionId: number) {
    const [inserted] = await tr("warehouses").insert({ name, region_id: regionId }).onConflict("name").ignore().returning("*");

    return inserted ?? (await tr("warehouses").where({ name }).first());
}

export async function upsertTariff(
    tr: Knex.Transaction,
    warehouseId: number,
    date: string,
    data: NormalizedTariff,
    meta: { dtNextBox: string | null; dtTillMax: string | null },
) {

    const { region_name: _rn, warehouse_name: _wn, ...numeric } = data

    await tr("wb_tariffs_daily")
        .insert({
            date,
            warehouse_id: warehouseId,
            ...numeric,
            source_dt_next_box: meta.dtNextBox?.trim() || null,
            source_dt_till_max: meta.dtTillMax?.trim() || null,
        })
        .onConflict(["date", "warehouse_id"])
        .merge({
            ...Object.fromEntries(Object.keys(numeric).map((k) => [k, tr.raw(`EXCLUDED.${k}`)])),
            source_dt_next_box: tr.raw("EXCLUDED.source_dt_next_box"),
            source_dt_till_max: tr.raw("EXCLUDED.source_dt_till_max"),
            updated_at: tr.fn.now(),
        });
}
