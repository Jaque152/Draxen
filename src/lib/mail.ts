import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'ventas@tu-nueva-agencia.com'; 
const INTERNAL_EMAIL = 'contacto@tu-nueva-agencia.com';

const formatPrice = (price: number) => 
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

export async function sendReceiptEmail(
  checkout: any, 
  items: any[], 
  isEnglish: boolean = false
) {
  // Paleta de lujo extraída de tu CSS
  const bgDark = '#0F0F1A';     // --navy
  const cardDark = '#1A1B2E';   // --charcoal
  const textAccent = '#C87941'; // --copper
  const textLight = '#F5F0E8';  // --cream
  const textMuted = '#9ca3af';  // Gris suave para subtítulos

  const subjectClient = isEnglish 
    ? `Purchase Confirmation - Welcome to our Agency` 
    : `Confirmación de Compra - Bienvenido a nuestra Agencia`;

  const htmlClient = `
    <div style="font-family: 'Times New Roman', Times, serif; max-width: 600px; margin: auto; color: ${textLight}; background-color: ${bgDark}; border: 1px solid #2d2e40; border-radius: 12px; overflow: hidden;">
      <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #2d2e40;">
        <h1 style="color: ${textLight}; margin: 0; font-size: 26px; font-weight: normal; letter-spacing: 2px;">NUESTRA AGENCIA</h1>
        <p style="color: ${textAccent}; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; font-family: Arial, sans-serif; margin-top: 10px;">Estrategias de Élite</p>
      </div>
      <div style="padding: 40px 30px; font-family: Arial, sans-serif;">
        <h2 style="color: ${textLight}; margin-top: 0; font-size: 20px; font-weight: normal; font-family: 'Times New Roman', Times, serif;">Estimado/a ${checkout.nombre},</h2>
        <p style="font-size: 15px; color: ${textMuted}; line-height: 1.6;">Hemos recibido su pago correctamente. Su estrategia de marketing ha entrado en fase de desarrollo.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <thead>
            <tr style="border-bottom: 1px solid #2d2e40; text-align: left;">
              <th style="padding: 12px 0; color: ${textMuted}; font-size: 12px; text-transform: uppercase; font-weight: normal;">Servicio Adquirido</th>
              <th style="padding: 12px 0; color: ${textMuted}; font-size: 12px; text-transform: uppercase; text-align: right; font-weight: normal;">Inversión</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #2d2e40;">
                <td style="padding: 15px 0; color: ${textLight}; font-size: 14px;">
                  ${item.plans_nc.title} 
                  ${item.quote_id ? `<br><span style="font-size:12px; color:${textAccent}">Ref: ${item.quote_id}</span>` : ''}
                </td>
                <td style="padding: 15px 0; text-align: right; color: ${textLight}; font-size: 14px;">${formatPrice(item.custom_price || item.plans_nc.price)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="background-color: ${cardDark}; border-radius: 8px; padding: 25px; text-align: right; border: 1px solid #2d2e40;">
          <span style="font-size: 12px; color: ${textMuted}; text-transform: uppercase; letter-spacing: 1px;">Total (IVA Incluido)</span>
          <span style="font-size: 26px; font-family: 'Times New Roman', Times, serif; color: ${textAccent}; display: block; margin-top: 5px;">${formatPrice(checkout.total_estimado)}</span>
        </div>
      </div>
    </div>
  `;

  // El correo interno 
  const htmlInternal = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: ${textAccent};">Notificación de Venta</h2>
      <p><strong>Inversión Total:</strong> ${formatPrice(checkout.total_estimado)}</p>
      <p><strong>Cliente:</strong> ${checkout.nombre} ${checkout.apellidos}</p>
      <p><strong>Email:</strong> ${checkout.correo_electronico}</p>
      <p><strong>Teléfono:</strong> ${checkout.telefono}</p>
      <hr/>
      <h3>Desglose:</h3>
      <ul>
        ${items.map(i => `<li>${i.plans_nc.title} - ${formatPrice(i.custom_price || i.plans_nc.price)}</li>`).join('')}
      </ul>
    </div>
  `;

  await resend.emails.send({
    from: `Agencia <${FROM_EMAIL}>`,
    to: [checkout.correo_electronico],
    subject: subjectClient,
    html: htmlClient,
  });

  await resend.emails.send({
    from: `Sistema Web <${FROM_EMAIL}>`,
    to: [INTERNAL_EMAIL],
    subject: `[NUEVA COMPRA] ${formatPrice(checkout.total_estimado)} - ${checkout.nombre}`,
    html: htmlInternal,
  });
}