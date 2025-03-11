import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import rutasUsuario from "./src/routes/rutasdeUsuario";
import rutasCliente from "./src/routes/rutasdeCliente";
import rutasServicios from "./src/routes/rutasdeServicio";
import rutasCariñan from "./src/routes/rutasCariñan";

const app = express();

dotenv.config();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/usuario', rutasUsuario);  // Agregamos la ruta de usuario
app.use('/cliente', rutasCliente); // Agregamos la ruta de cliente
app.use('/servicios', rutasServicios); // Agregamos la ruta de servicios
app.use('/clientes', rutasCariñan); // Agregamos la ruta de cariñan

const PORT: number = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
})