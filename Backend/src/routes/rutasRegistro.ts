import { Router } from 'express';
import { registroUsuario } from '../controllers/registrocontroller'; // Asegúrate de importar correctamente el controlador

const rutas = Router();

// Ruta para registrar un usuario
rutas.post('/registro', registroUsuario);

export default rutas;
