import { z } from "zod";

const clienteNuevoSchema = z.object ({
<<<<<<< HEAD
    nombre: z.string().min(64, { message: "El nombre es obligatorio" }),
    direccion: z.string().min(64, { message: "La dirección es obligatoria" }),
    telefono: z.string().min(12, { message: "El numero de teléfono es obligatorio" }),
    nombreDependencia: z.string().min(64, { message: "El nombre de la dependencia es obligatorio" }),
    contrato: z.string().min(20, { message: "El contrato es obligatorio" }),
    numeroMedidor: z.string().min(20,{ message: "El número del medidor es obligatorio" }),
  });
// aqui no puedo poner el export defaut creo porque debo llamarla desde la carpeta que ponga kath 
export default clienteNuevoSchema
=======
    nombre: z.string().min(32, { message: "El nombre es obligatorio" }),
    direccion: z.string().min(32, { message: "La dirección es obligatoria" }),
    telefono: z.string().min(10, { message: "El numero de teléfono es obligatorio" }),
    nombreDependencia: z.string().min(24, { message: "El nombre de la dependencia es obligatorio" }),
    id_medidor: z.string().max(12,{ message: "El número del medidor es obligatorio" }),
  });
// aqui no puedo poner el export defaut creo porque debo llamarla desde la carpeta que ponga kath
export default clienteNuevoSchema;
>>>>>>> 31068e428c161f30bd2e9b8f4298d8dbb0459081
