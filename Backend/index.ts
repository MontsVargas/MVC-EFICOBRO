import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import rutasUsuario from "./src/routes/rutasdeUsuario";

const app = express();

app.use(cors())

dotenv.config();

app.use(cors({
    credentials: true,
}))

app.use(express.json());

app.use(cookieParser());

app.use('/usuario', rutasUsuario);


const PORT: number = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
})