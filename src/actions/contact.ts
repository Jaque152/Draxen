'use server';

import { createClient } from '@/lib/supabase/server';
import { ContactSchema, ContactFormData } from '@/schemas/contact';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const INTERNAL_EMAIL = 'contacto@marketingresultados.com'; // Tu correo real

export async function submitContactForm(data: ContactFormData) {
  try {
    // 1. Validación estricta con Zod en el servidor
    const validatedData = ContactSchema.parse(data);
    const supabase = await createClient();

    // 2. Guardar en Base de Datos (Tabla contacts_nc)
    const { error: dbError } = await supabase
      .from('contacts_nc')
      .insert({
        nombre_completo: validatedData.nombre_completo,
        empresa_negocio: validatedData.empresa_negocio,
        telefono: validatedData.telefono,
        correo_electronico: validatedData.correo_electronico,
        asunto: validatedData.asunto,
        mensaje: validatedData.mensaje,
      });

    if (dbError) throw new Error("No se pudo guardar el mensaje en la base de datos.");

    // 3. Enviar correo de notificación a tu equipo
    await resend.emails.send({
      from: 'Sistema Web <ventas@marketingresultados.com>',
      to: [INTERNAL_EMAIL],
      subject: `[NUEVO CONTACTO] - ${validatedData.asunto}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #C87941;">Nuevo mensaje de la web</h2>
          <p><strong>Nombre:</strong> ${validatedData.nombre_completo}</p>
          <p><strong>Empresa:</strong> ${validatedData.empresa_negocio}</p>
          <p><strong>Email:</strong> ${validatedData.correo_electronico}</p>
          <p><strong>Teléfono:</strong> ${validatedData.telefono}</p>
          <hr/>
          <p><strong>Mensaje:</strong></p>
          <p style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${validatedData.mensaje}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error en contacto:", error);
    return { success: false, error: error.message || "Error procesando la solicitud." };
  }
}