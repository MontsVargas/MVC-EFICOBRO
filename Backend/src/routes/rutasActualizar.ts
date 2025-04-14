import { Router, Request, Response } from "express";
import { actualizarCompra, Compra, Servicios, Plantas, TiposServicio} from "../controllers/actualizarCompras";

const rutas = Router();

rutas.get("/obtener/:id", (req: Request, res: Response) => {
  Compra(req, res);
});

rutas.patch("/compras/:id", (req: Request, res: Response) => {
  actualizarCompra(req, res);
});

rutas.get("/servicios", (req: Request, res: Response) => {
  Servicios(req, res);
});

rutas.get("/plantas", (req: Request, res: Response) => {
  Plantas(req, res);
});

rutas.get("/tiposServicio", (req: Request, res: Response) => {
  TiposServicio(req, res);
});
export default rutas;