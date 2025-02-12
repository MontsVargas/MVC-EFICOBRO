import { z } from "zod";

const registroSchema = z.object({
    nombre: z
      .string({ required_error: "El campo nombre es obligatorio" })
      .min(1, { message: "Ingrese un nombre valido" }),
      
    correo: z
      .string({ required_error: "El campo correo es obligatorio" })
      .email({ message: "Ingrese un correo valido" }),

    contraseña: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(8, { message: "La contraseña debe contener al menos 8 caracteres" }),

    telefono: z
      .string({ required_error: "El campo teléfono es obligatorio" })
      .regex(/^\d{12}$/, { message: "Ingrese un número de teléfono válido (10 dígitos)" })
});

export default registroSchema;
