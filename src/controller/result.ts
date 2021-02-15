import { quorum } from "../config.json";
import { runQuery } from "../infra/mssql";
import moment from "moment";

export const resultController = async (req: any, res: any) => {
    try {
        const token = req.headers.token
        const id = parseInt(token)
        const resultQueueNo = await getQueueNo(id)
        const queueNo = resultQueueNo?.recordset[0].queue_no
        const result = queueNo <= quorum ? 'dipilih untuk hadir' : 'tidak dipilih untuk'
        const nextDate = moment().day(5).format('D MMM YYYY')
        res.status(200).json({
            result,
            nextDate
        })
    }
    catch(err) {
        console.error(err)
    }
}

const getQueueNo = async (id: number) => {
    try {
        const query = `SELECT queue_no 
            FROM ssi.dbo.[user] 
            WHERE id = @id;`
    
        const data = {
            id
        }
    
        return await runQuery(query, data)
    }
    catch(err) {
        console.error(err)
    }
}