import { Router, Request, Response } from "express";
import { actualizarCompra, Compra, Servicios, Plantas, TiposServicio} from "../controllers/actualizarCompras";

const router = Router();

router.get("/obtener/:id", (req: Request, res: Response) => {
  Compra(req, res);
});

router.patch("/compras/:id", (req: Request, res: Response) => {
  actualizarCompra(req, res);
});

router.get("/servicios", (req: Request, res: Response) => {
  Servicios(req, res);
});

router.get("/plantas", (req: Request, res: Response) => {
  Plantas(req, res);
});

router.get("/tiposServicio", (req: Request, res: Response) => {
  TiposServicio(req, res);
});
export default router;