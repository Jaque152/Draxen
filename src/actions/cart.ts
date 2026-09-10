'use server';
import { sendContactConfirmationEmail, ContactFormData } from '@/lib/mail';

export async function submitContact(formData: ContactFormData, locale: string = 'es') {
  try {
    // 1. Enviar correo de confirmación al cliente y copia al equipo
    await sendContactConfirmationEmail(formData, locale === 'en');

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al enviar el mensaje";
    return { success: false, message: errorMessage };
  }
}