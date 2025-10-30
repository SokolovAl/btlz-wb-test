import type { WBResponse } from "./tariffSchema.js";

export interface NormalizedTariff {
    region_name: string;
    warehouse_name: string;
    box_delivery_base: number | null;
    box_delivery_coef: number | null;
    box_delivery_marketplace_base: number | null;
    box_delivery_marketplace_coef: number | null;
    box_storage_base: number | null;
    box_storage_coef: number | null;
    box_delivery_liter: number | null;
    box_delivery_marketplace_liter: number | null;
    box_storage_liter: number | null;
}

function parseNum(value: string | null | undefined): number | null {
    if (!value) return null;
    return parseFloat(value.replace(",", "."));
}

export function normalizeTariffs(wbData: WBResponse): {
    dtNextBox: string | null;
    dtTillMax: string | null;
    tariffs: NormalizedTariff[];
} {
    const { dtNextBox, dtTillMax, warehouseList } = wbData.response.data;

    const tariffs = warehouseList.map((item) => ({
        region_name: item.geoName,
        warehouse_name: item.warehouseName,
        box_delivery_base: parseNum(item.boxDeliveryBase),
        box_delivery_coef: parseNum(item.boxDeliveryCoefExpr),
        box_delivery_marketplace_base: parseNum(item.boxDeliveryMarketplaceBase),
        box_delivery_marketplace_coef: parseNum(item.boxDeliveryMarketplaceCoefExpr),
        box_storage_base: parseNum(item.boxStorageBase),
        box_storage_coef: parseNum(item.boxStorageCoefExpr),
        box_delivery_liter: parseNum(item.boxDeliveryLiter),
        box_delivery_marketplace_liter: parseNum(item.boxDeliveryMarketplaceLiter),
        box_storage_liter: parseNum(item.boxStorageLiter),
    }));

    return { dtNextBox, dtTillMax, tariffs };
}