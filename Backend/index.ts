import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express()

app.use(cors())

dotenv.config()

const PORT: number = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
})