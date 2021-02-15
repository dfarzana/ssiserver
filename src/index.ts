import express from "express";
import { router } from "./router";
import { CronJob } from "cron";
import { cronJob } from "./controller/cronJob";
import { cronTime } from "./config.json";

const app = express()

app.get('/', (req,res) => {
    res.json({
        message:'Helo semua'
    })
})

app.use(express.json())
app.use('/api', router)

try {
    new CronJob({
        cronTime,
        onTick: ()=> {
            cronJob()
        },
        start:true,
        timeZone:'Asia/Kuala_Lumpur'
    })
    
} catch (error) {
    console.error(error)
}

app.listen(3000, () => {
    console.log('xdepape pun pi tido')
})