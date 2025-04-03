import { z } from "zod";

const iniciarSesionSchema = z.object({
    usuarios: z
      .string({ required_error: "El campo usuario es obligatorio"})
      .email({ message: "Ingrese un usuario valido"}),
    contraseña: z
    .string ({required_error: "La contraseña es incorrecta"})
    .min (8, {message: "La contraseña debe contener al menos 8 caracteres" })
});
export default iniciarSesionSchema;