import { z } from "zod";

export const CheckoutSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido."),
  apellidos: z.string().min(2, "Los apellidos son requeridos."),
  correo_electronico: z.string().email("Correo inválido."),
  telefono: z.string().min(10, "Teléfono inválido."),
  pais_region: z.string().min(2, "País requerido."),
  direccion_calle: z.string().min(5, "Dirección requerida."),
  localidad_ciudad: z.string().min(2, "Ciudad requerida."),
  region_estado: z.string().min(2, "Estado requerido."),
  codigo_postal: z.string().min(4, "Código postal requerido."),
});

export type CheckoutFormData = z.infer<typeof CheckoutSchema>;