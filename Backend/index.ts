import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import rutasUsuario from "./src/routes/rutasdeUsuario";
import rutasCliente from "./src/routes/rutasdeCliente";
import rutasServicios from "./src/routes/rutasdeServicio";
import rutasCariñan from "./src/routes/rutasCarinan";
import rutasPdf from "./src/routes/rutasdeGReporte";
import rutasdeHistorial from "./src/routes/rutasdeHistorial" 
import rutasActualizar from "./src/routes/rutasActualizar"
const app = express();

dotenv.config();

app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use('/usuario', rutasUsuario);  // Agregamos la ruta de usuario
app.use('/cliente', rutasCliente); // Agregamos la ruta de cliente
app.use('/servicios', rutasServicios); // Agregamos la ruta de servicios
app.use('/clientes', rutasCariñan); // Agregamos la ruta de cariñan
app.use('/pdf', rutasPdf); // Agregamos la ruta de pdf
app.use('/historial', rutasdeHistorial); // Agregamos la ruta de historial
app.use('/actualizar', rutasActualizar);


const PORT: number = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`)
})