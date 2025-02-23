import { z } from "zod";

const clienteNuevoSchema = z.object({

    nombre: z.string().min(18, { message: "El nombre es obligatorio" }),
    direccion: z.string().min(20, { message: "La dirección es obligatoria" }),
    telefono: z.string().min(10, { message: "El numero de teléfono es obligatorio" }),
    nombreDependencia: z.string().min(18, { message: "El nombre de la dependencia es obligatorio" }),
    id_medidor: z.string().max(12,{ message: "El número del medidor es obligatorio" }),
  });
// aqui no puedo poner el export defaut creo porque debo llamarla desde la carpeta que ponga kath
export default clienteNuevoSchema;

