import { z } from "zod";

export const zDateOrNull = z.preprocess((v) => {
    if (v == null) return null;
    if (typeof v === "string" && v.trim() === "") {
        return null;
    }
    return v;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable());

export const warehouseSchema = z.object({
    geoName: z.string(),
    warehouseName: z.string(),
    boxDeliveryBase: z.string(),
    boxDeliveryCoefExpr: z.string(),
    boxDeliveryMarketplaceBase: z.string(),
    boxDeliveryMarketplaceCoefExpr: z.string(),
    boxStorageBase: z.string(),
    boxStorageCoefExpr: z.string(),
    boxDeliveryLiter: z.string().nullable().optional(),
    boxDeliveryMarketplaceLiter: z.string().nullable().optional(),
    boxStorageLiter: z.string().nullable().optional(),
});

export const wbResponseSchema = z.object({
    response: z.object({
        data: z.object({
            dtNextBox: zDateOrNull,
            dtTillMax: zDateOrNull,
            warehouseList: z.array(warehouseSchema),
        }),
    }),
});

export type WBResponse = z.infer<typeof wbResponseSchema>;
