import { z } from "zod";

const registroSchema = z.object({
    nombre: z
      .string({ required_error: "El campo de nombre es obligatorio" })
      .min(2, { message: "Ingresa un nombre valido" }),
      
    correo: z
      .string({ required_error: "El campo de correo es obligatorio" })
      .email({ message: "Ingresa un correo valido" }),

    contraseña: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(8, { message: "La contraseña debe tener 8 caracteres" }),

    telefono: z
      .string({ required_error: "El campo de numero de teléfono es obligatorio" })
      .regex(/^\d{12}$/, { message: "Ingresa un número de teléfono 12 digitos" })
});

export default registroSchema;
