import sql from "mssql";
import { dbConfig } from "../config.json";

const pool1 = new sql.ConnectionPool(dbConfig);
const pool1Connect = pool1.connect();

pool1.on('error', err => {
    // ... error handler
})

export async function runQuery(queryString: string, queryData: any) {
    await pool1Connect; // ensures that the pool has been created
    try {
        const request = pool1.request(); // or: new sql.Request(pool1)
        for (const key in queryData) {
            request.input(key, queryData[key])
        }
        const result = await request.query(queryString)
        console.dir(result)
        return result;
    } catch (err) {
        console.error('SQL error', err);
    }
}