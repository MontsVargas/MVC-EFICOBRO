import { Router, Request, Response } from "express";
import { actualizarCompra, obtenerCompra } from "../controllers/actualizarCompras";

const router = Router();
router.get ("/obtener/:id", (req: Request, res: Response) => {
 obtenerCompra(req, res);
}),

// Ruta para actualizar parcialmente una compra
router.patch("/compras/:id", (req: Request, res: Response) => {
    actualizarCompra(req, res);
});

export default router;
