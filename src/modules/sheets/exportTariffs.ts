import type { Knex } from "knex";
import { makeSheetsClient } from "./gSheetsClient.js";
import knex from "#postgres/knex.js";

export async function fetchTodayTariffs(tr?: Knex.Transaction) {
    const k = tr ?? knex;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const rows = await k("wb_tariffs_daily as t")
        .join("warehouses as w", "w.id", "t.warehouse_id")
        .join("regions as r", "r.id", "w.region_id")
        .select(
            "r.name as region_name",
            "w.name as warehouse_name",
            "t.box_delivery_coef",
            "t.box_delivery_marketplace_coef"
        )
        .where("t.date", today)
        .orderBy("t.box_delivery_coef", "asc");

    return rows;
}

export function toSheetValues(rows: any[]): (string | number)[][] {
    const header = [
        "region_name",
        "warehouse_name",
        "box_delivery_coef",
        "box_delivery_marketplace_coef",
    ];

    const data = rows.map((r: any) => [
        r.region_name,
        r.warehouse_name,
        Number(r.box_delivery_coef),
        Number(r.box_delivery_marketplace_coef),
    ]);

    return [header, ...data];
}

export async function pushToSheet(spreadsheetId: string, values: (string | number)[][]) {
    const sheets = makeSheetsClient();
    const range = "stocks_coefs";
    await sheets.spreadsheets.values.clear({ spreadsheetId, range });

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody: { values },
    });
}

export async function pushToAllSheets() {
    const ids = (process.env.GSHEETS_IDS ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (ids.length === 0) throw new Error("GSHEETS_IDS is empty");

    const rows = await fetchTodayTariffs();
    const values = toSheetValues(rows);

    for (const id of ids) {
        await pushToSheet(id, values);
        console.log(`[sheets] pushed ${rows.length} rows → ${id}`);
    }
}
