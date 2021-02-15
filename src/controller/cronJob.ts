import { runQuery } from "../infra/mssql";
import { quorum } from "../config.json";

export const cronJob = ()=>{
    selectAll().then(async (result) => {
        const allUser = result?.recordset
        const rotateSelected = allUser?.concat(allUser.splice(0, quorum))
        rotateSelected?.forEach(async (user, index) => {
            user.queue_no = index + 1
            await updateSelected(user.queue_no, user.id)
        })
    }).catch(err=>{
        console.error(err)
    })
}

const selectAll = async () => {
    try {
        const query = `SELECT id, queue_no 
            FROM ssi.dbo.[user] 
            order by queue_no;`
    
        const data = {}
    
        return await runQuery(query, data)
    }
    catch(err) {
        console.error(err)
    }
}

const updateSelected = async (queue_no:number, id: number) => {
    try {
        const query = `UPDATE ssi.dbo.[user]
            SET queue_no = @queue_no WHERE id = @id;`
    
        const data = {
            queue_no,
            id
        }
    
        return await runQuery(query, data)
    }
    catch(err) {
        console.error(err)
    }
}