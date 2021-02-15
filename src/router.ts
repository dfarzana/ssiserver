import express from "express";
import { registerController } from "./controller/register";
import { resultController } from "./controller/result";

const router = express.Router()

router.post('/register', (req,res) => registerController(req,res))
router.get('/result', (req,res) => resultController(req,res))

export {
    router
}
