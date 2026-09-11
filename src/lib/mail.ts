// src/lib/mail.ts
import { Resend } from 'resend';
import { plans } from '@/data/plans';
import { CartItem, Checkout } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'ventas@draxendigital.com'; 
const INTERNAL_EMAIL = 'info@draxendigital.com';

// Paleta Ciber-Audaz adaptada para clientes de correo
const emailTheme = {
  bgDark: '#020617', // Slate 950
  cardDark: '#0f172a', // Slate 900
  accentCyan: '#06b6d4',
  accentMagenta: '#d946ef',
  textLight: '#f8fafc',
  textMuted: '#94a3b8',
  borderDark: '#1e293b'
};

type ReceiptCheckout = Pick<Checkout, 'id' | 'nombre' | 'apellidos' | 'correo_electronico' | 'telefono' | 'subtotal' | 'impuesto' | 'total_estimado'>;
// ============================================================================
// 1. EMAIL DE CHECKOUT (Cliente e Interno)
// ============================================================================
export async function sendReceiptEmail(
  checkout: ReceiptCheckout,
  items: CartItem[], 
  isEnglish: boolean = false,
  currency: string = 'MXN',
  exchangeRate: number = 1
) {
  // Función formateadora dinámica local
  const formatCurrency = (amount: number) => {
    const isUsd = currency === 'USD';
    const finalAmount = isUsd && exchangeRate > 1 ? amount / exchangeRate : amount;
    return new Intl.NumberFormat(isUsd ? 'en-US' : 'es-MX', {
      style: 'currency',
      currency: isUsd ? 'USD' : 'MXN',
      minimumFractionDigits: 2,
    }).format(finalAmount) + ` ${currency}`;
  };

  // Enriquecemos los items cruzando el ID del carrito con nuestro diccionario local
  const enrichedItems = items.map(item => {
    const planDict = plans.find(p => p.id === item.plan_id);
    const title = planDict 
        ? (isEnglish ? planDict.en.title : planDict.es.title) 
        : (isEnglish ? 'Custom Plan' : 'Plan Personalizado');
    const basePrice = item.custom_price !== null 
        ? item.custom_price 
        : (planDict?.price || 0);
    
    return { ...item, title, price: basePrice };
  });

  // --- A. PLANTILLA DISRUPTIVA PARA EL CLIENTE ---
  const subjectClient = isEnglish 
    ? `System Activated - Welcome to Draxen Digital` 
    : `Sistema Activado - Bienvenido a Draxen Digital`;

  const htmlClient = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; color: ${emailTheme.textLight}; background-color: ${emailTheme.bgDark}; border-radius: 16px; overflow: hidden; border: 1px solid ${emailTheme.borderDark};">
      
      <!-- Cabecera con franja de neón -->
      <div style="background-color: ${emailTheme.cardDark}; padding: 40px 30px; text-align: center; border-bottom: 3px solid ${emailTheme.accentMagenta};">
        <h1 style="color: ${emailTheme.textLight}; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">
          DRAXEN DIGITAL<span style="color: ${emailTheme.accentCyan};">.</span>
        </h1>
        <p style="color: ${emailTheme.accentMagenta}; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; margin-top: 10px; font-weight: bold;">Performance Agency</p>
      </div>

      <div style="padding: 40px 30px;">
        <h2 style="color: ${emailTheme.textLight}; margin-top: 0; font-size: 20px; font-weight: 700;">${isEnglish ? 'Hello' : 'Hola'} ${checkout.nombre},</h2>
        <p style="font-size: 15px; color: ${emailTheme.textMuted}; line-height: 1.6;">
          ${isEnglish 
            ? 'Your payment was successfully processed. Your growth system is now in the development phase.' 
            : 'Tu pago fue procesado con éxito. Tu sistema de crecimiento ha entrado en fase de desarrollo.'}
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <thead>
            <tr style="border-bottom: 1px solid ${emailTheme.borderDark}; text-align: left;">
              <th style="padding: 12px 0; color: ${emailTheme.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">${isEnglish ? 'Service' : 'Servicio'}</th>
              <th style="padding: 12px 0; color: ${emailTheme.textMuted}; font-size: 11px; text-transform: uppercase; text-align: right; letter-spacing: 1px;">${isEnglish ? 'Investment' : 'Inversión'}</th>
            </tr>
          </thead>
          <tbody>
            ${enrichedItems.map(item => `
              <tr style="border-bottom: 1px solid ${emailTheme.borderDark};">
                <td style="padding: 15px 0; color: ${emailTheme.textLight}; font-size: 14px; font-weight: 600;">
                  ${item.quantity > 1 ? `${item.quantity}x ` : ''}${item.title}
                  ${item.quote_id ? `<br><span style="font-size:12px; color:${emailTheme.accentCyan}; font-family: monospace;">Ref: ${item.quote_id}</span>` : ''}
                </td>
                <td style="padding: 15px 0; text-align: right; color: ${emailTheme.textLight}; font-size: 14px; font-weight: bold;">${formatCurrency(item.price)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="background-color: ${emailTheme.cardDark}; border-radius: 12px; padding: 25px; text-align: right; border-left: 4px solid ${emailTheme.accentCyan};">
          <span style="font-size: 11px; color: ${emailTheme.textMuted}; text-transform: uppercase; letter-spacing: 1px;">Total (${isEnglish ? 'VAT Included' : 'IVA Incluido'})</span>
          <span style="font-size: 28px; font-weight: 800; color: ${emailTheme.accentMagenta}; display: block; margin-top: 5px;">${formatCurrency(checkout.total_estimado)}</span>
        </div>
      </div>
    </div>
  `;

  // --- B. PLANTILLA PARA EL EQUIPO INTERNO ---
  const htmlInternal = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;">⚡ Nueva Venta - Draxen Digital</h2>
      <p style="color: #555;"><strong>ID Transacción:</strong> ${checkout.id}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td colspan="2" style="background: #f4f6f8; padding: 10px; font-weight: bold; color: #333;">Datos del Cliente</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 30%;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${checkout.nombre} ${checkout.apellidos}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${checkout.correo_electronico}">${checkout.correo_electronico}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${checkout.telefono || 'No proporcionado'}</td></tr>
      </table>

      <h3 style="margin-top: 25px; color: #333;">Detalle del Arsenal Adquirido</h3>
      <ul style="color: #444;">
        ${enrichedItems.map(item => `
          <li style="margin-bottom: 8px;">
            ${item.quantity}x <strong>${item.title}</strong> 
            - ${formatCurrency(item.price)}
          </li>
        `).join('')}
      </ul>
      
      <div style="margin-top: 20px; padding: 15px; background: #0f172a; color: white; border-radius: 6px; text-align: right;">
        <p style="margin: 5px 0; color: #94a3b8;">Subtotal: ${formatCurrency(checkout.subtotal)}</p>
        <p style="margin: 5px 0; color: #94a3b8;">Impuestos: ${formatCurrency(checkout.impuesto)}</p>
        <p style="margin: 10px 0 0 0; font-size: 18px; color: #d946ef;"><strong>TOTAL COBRADO: ${formatCurrency(checkout.total_estimado)}</strong></p>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: `Draxen Digital <${FROM_EMAIL}>`,
      to: [checkout.correo_electronico],
      subject: subjectClient,
      html: htmlClient,
    }),
    resend.emails.send({
      from: `Sales Bot <${FROM_EMAIL}>`,
      to: [INTERNAL_EMAIL],
      subject: `[VENTA] ${checkout.nombre} ${checkout.apellidos} - ${formatCurrency(checkout.total_estimado)}`,
      html: htmlInternal,
    })
  ]);
}

// ============================================================================
// 2. EMAIL DE CONTACTO (Cliente e Interno)
// ============================================================================
export interface ContactFormData {
  nombre_completo: string;
  empresa_negocio: string;
  telefono: string;
  correo_electronico: string;
  asunto: string;
  mensaje: string;
}

export async function sendContactConfirmationEmail(data: ContactFormData, isEnglish: boolean = false) {
  
  // --- A. PLANTILLA DISRUPTIVA PARA EL CLIENTE ---
  const subjectClient = isEnglish 
    ? "Signal Received - Draxen Digital" 
    : "Señal Recibida - Draxen Digital";
  
  const htmlClient = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; color: ${emailTheme.textLight}; background-color: ${emailTheme.bgDark}; border-radius: 16px; overflow: hidden; border: 1px solid ${emailTheme.borderDark};">
      
      <div style="background-color: ${emailTheme.cardDark}; padding: 40px 30px; text-align: center; border-bottom: 3px solid ${emailTheme.accentCyan};">
        <h1 style="color: ${emailTheme.textLight}; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">
          DRAXEN DIGITAL<span style="color: ${emailTheme.accentMagenta};">.</span>
        </h1>
      </div>
      
      <div style="padding: 40px 30px;">
        <h2 style="color: ${emailTheme.textLight}; margin-top: 0; font-size: 20px; font-weight: 700;">
          ${isEnglish ? `Hi ${data.nombre_completo},` : `Hola ${data.nombre_completo},`}
        </h2>
        <p style="font-size: 15px; color: ${emailTheme.textMuted}; line-height: 1.6;">
          ${isEnglish 
            ? 'We have received your data. Our performance team is reviewing your case and will contact you shortly to start hacking your growth.' 
            : 'Hemos interceptado tus datos correctamente. Nuestro equipo de performance está revisando tu caso y te contactará en breve.'}
        </p>

        <div style="background-color: ${emailTheme.cardDark}; border-radius: 12px; padding: 25px; margin-top: 30px; border-left: 4px solid ${emailTheme.accentMagenta};">
          <p style="font-size: 14px; color: ${emailTheme.textMuted}; margin: 5px 0;"><strong>${isEnglish ? 'Subject:' : 'Asunto:'}</strong> ${data.asunto}</p>
          <p style="font-size: 14px; color: ${emailTheme.textMuted}; margin: 5px 0;"><strong>${isEnglish ? 'Company:' : 'Empresa:'}</strong> ${data.empresa_negocio}</p>
        </div>
      </div>
    </div>
  `;

  // --- B. PLANTILLA PARA EL EQUIPO INTERNO ---
  const htmlInternal = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #d946ef; border-bottom: 2px solid #d946ef; padding-bottom: 10px;">🎯 Nuevo Lead de Contacto</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 30%; color: #555;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.nombre_completo}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #555;"><strong>Empresa:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.empresa_negocio}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #555;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.correo_electronico}">${data.correo_electronico}</a></td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #555;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.telefono}</td></tr>
      </table>

      <div style="margin-top: 25px;">
        <h3 style="color: #333; margin-bottom: 10px;">Mensaje Original:</h3>
        <div style="white-space: pre-wrap; color: #333; background: #f4f6f8; padding: 15px; border-left: 4px solid #d946ef; border-radius: 4px; font-size: 14px; line-height: 1.6;">${data.mensaje}</div>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: `Draxen Digital <${FROM_EMAIL}>`,
      to: [data.correo_electronico],
      subject: subjectClient,
      html: htmlClient,
    }),
    resend.emails.send({
      from: `Web Bot <${FROM_EMAIL}>`,
      to: [INTERNAL_EMAIL],
      subject: `[LEAD] ${data.asunto} - ${data.empresa_negocio}`,
      html: htmlInternal,
    })
  ]);
}