import { runQuery } from "../infra/mssql"

export const registerController = async (req: any,res: any) => {
    try { 
        const name = req.body.name
        const phoneno = req.body.phoneno
        const result = await checkUserExist(name, phoneno)
        if (result?.recordset[0].count == 0) {
            const topQueueNo = await getTopQueueNo()
            const result = await insertUserTable(name, phoneno, topQueueNo?.recordset[0].queue_no + 1)
            const userToken = result?.recordset[0].id.toString()
            res.status(201).json({
                userToken
            })
        }
        else {
            const result = await getUserId(name, phoneno)
            const userToken = result?.recordset[0].id.toString()
            res.status(200).json({
                userToken
            })
        }
    }
    catch(err) {
        console.error(err)
        res.sendStatus(500)
    }
}

const checkUserExist = async (name: string, phoneno: string) => {
    try {
        const query = `SELECT count(*) as count 
            FROM ssi.dbo.[user] 
            WHERE name = @name 
            AND phoneno = @phoneno;`
    
        const data = {
            name,
            phoneno
        }
    
        return await runQuery(query, data)
    }
    catch(err) {
        console.error(err)
    }
}

const getTopQueueNo = async () => {
    try {
        const query = `SELECT top(1) queue_no 
            FROM ssi.dbo.[user] 
            order by queue_no desc;`
    
        const data = {}
    
        return await runQuery(query, data)
    }
    catch(err) {
        console.error(err)
    }
}

const insertUserTable = async (name: string, phoneno: string, queue_no: number) => {
    try {
        const query = `INSERT INTO ssi.dbo.[user] 
            (name, phoneno, queue_no) 
            OUTPUT INSERTED.[id] as id
            VALUES 
            (@name, @phoneno, @queue_no);`
    
        const data = {
            name,
            phoneno,
            queue_no
        }
    
        return await runQuery(query, data)
    }
    catch(err) {
        console.error(err)
    }
}

const getUserId = async (name: string, phoneno: string) => {
    try {
        const query = `SELECT id  
            FROM ssi.dbo.[user] 
            WHERE name = @name 
            AND phoneno = @phoneno;`
    
        const data = {
            name,
            phoneno
        }
    
        return await runQuery(query, data)
    }
    catch(err) {
        console.error(err)
    }
}