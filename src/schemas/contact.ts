import { z } from "zod";

export const ContactSchema = z.object({
  nombre_completo: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  empresa_negocio: z.string().min(2, "El nombre de la empresa es requerido."),
  telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos."),
  correo_electronico: z.string().email("Debe ser un correo electrónico válido."),
  asunto: z.string().min(3, "El asunto es requerido."),
  mensaje: z.string().min(10, "El mensaje es muy corto, cuéntanos un poco más."),
});

export type ContactFormData = z.infer<typeof ContactSchema>;