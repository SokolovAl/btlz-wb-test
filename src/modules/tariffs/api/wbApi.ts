import env from "#config/env/env.js";
import axios from "axios";
import { wbResponseSchema } from "../model/tariffSchema.js";

function todayISO(d = new Date()) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export async function fetchWBTariffs(date = todayISO()) {
    const res = await axios.get(env.WB_API_URL, {
        params: { date },
        headers: { Authorization: `Bearer ${env.WB_API_TOKEN}` },
        timeout: 15000,
    });

    return wbResponseSchema.parse(res.data);
}
