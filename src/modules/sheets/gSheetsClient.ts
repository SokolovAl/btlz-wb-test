import { google } from "googleapis";
import fs from "node:fs";

type CredsSource = { jsonRaw?: string; jsonPath?: string };

function loadCreds({ jsonRaw, jsonPath }: CredsSource) {
    if (jsonRaw && jsonRaw.trim() !== "") {
        return JSON.parse(jsonRaw);
    }
    if (!jsonPath) throw new Error("GSHEETS_SA_JSON or GSHEETS_SA_JSON_PATH must be provided");
    const raw = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(raw);
}

export function makeSheetsClient() {
    const creds = loadCreds({
        jsonRaw: process.env.GSHEETS_SA_JSON,
        jsonPath: process.env.GSHEETS_SA_JSON_PATH,
    });

    const auth = new google.auth.GoogleAuth({
        credentials: creds,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: "v4", auth });
}
