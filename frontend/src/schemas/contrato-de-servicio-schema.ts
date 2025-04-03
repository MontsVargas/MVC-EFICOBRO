import {z} from "zod";

const contratoServicioSchema = z.object ({
    nombreCliente: z.string().min(1, { message: "El nombre del cliente es obligatorio." }),
    servicioContratar: z.string().min(1, { message: "El servicio a contratar es obligatorio." }),
    fechaContratacion: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: "La fecha debe tener el formato dd/mm/aaaa." }),
    cifraServicio: z.string().min(1, { message: "La cifra del servicio es obligatoria." }),
    planta: z.string().min(1, { message: "La planta es obligatoria." }),

})
export default contratoServicioSchema;