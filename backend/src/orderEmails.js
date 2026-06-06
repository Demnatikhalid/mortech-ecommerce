import { generateQuotePdf } from './quotePdf.js';

function formatPrice(amount) {
  return `${Number(amount).toFixed(2)} MAD`;
}

function buildEmailLayout({ title, bodyHtml, ctaLabel, ctaUrl, logoUrl }) {
  const buttonHtml = ctaLabel && ctaUrl ? `
    <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin-bottom:32px;">
      <tr>
        <td align="center">
          <a href="${ctaUrl}" style="display:inline-block;padding:14px 24px;background:#4f46e5;color:#ffffff;font-weight:600;border-radius:12px;text-decoration:none;font-size:16px;line-height:24px;">${ctaLabel}</a>
        </td>
      </tr>
    </table>
  ` : '';

  return `
    <html>
      <body style="margin:0;padding:0;font-family:Inter, system-ui, sans-serif;background-color:#f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f8fafc;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 24px 80px rgba(15,23,42,0.08);">
                <tr>
                  <td style="padding:32px 32px 0 32px;text-align:center;">
                    <img src="${logoUrl}" alt="Mortech Solution" width="170" style="display:block;margin:0 auto 20px auto;max-width:100%;height:auto;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 32px;">
                    <h1 style="margin:0 0 20px;font-size:28px;line-height:36px;color:#0f172a;">${title}</h1>
                    ${bodyHtml}
                    ${buttonHtml}
                    <p style="margin:0;font-size:16px;line-height:26px;color:#475569;">Merci pour votre confiance,<br/>L’équipe Mortech Solution E-Commerce</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 32px;">
                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;" />
                    <p style="margin:0;font-size:12px;line-height:20px;color:#94a3b8;">Mortech Solution · 470 Noor Ave STE B #1148, South San Francisco, CA 94080</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function isMailConfigured() {
  return process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS;
}

export async function sendCartValidatedEmail(transporter, order, baseUrl, logoUrl) {
  if (!isMailConfigured()) {
    console.warn('SMTP non configuré : impossible d’envoyer l’email de validation panier.');
    return;
  }

  const to = order.user?.email;
  if (!to) return;

  const name = order.user?.name || 'client';
  const itemsList = order.orderItems
    .map((item) => `- ${item.product?.name || 'Produit'} x${item.quantity} : ${formatPrice(item.price * item.quantity)}`)
    .join('\n');

  const subject = 'Votre panier a été validé — Mortech Solution';
  const text = `Bonjour ${name},\n\nVotre panier (commande #${order.id}) a été validé par notre équipe.\n\nDétail :\n${itemsList}\n\nTotal : ${formatPrice(order.total)}\n\nNous préparons votre commande et vous tiendrons informé(e) de son avancement.\n\nMerci,\nL’équipe Mortech Solution`;

  const bodyHtml = `
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#475569;">
      Bonjour <strong>${name}</strong>,<br/><br/>
      Votre panier <strong>(commande #${order.id})</strong> a été <strong style="color:#0d8b67;">validé</strong> par notre équipe.
    </p>
    <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:14px;color:#64748b;font-weight:600;">Récapitulatif</p>
      ${order.orderItems.map((item) => `
        <p style="margin:0 0 8px;font-size:14px;color:#334155;">
          ${item.product?.name || 'Produit'} × ${item.quantity} — <strong>${formatPrice(item.price * item.quantity)}</strong>
        </p>
      `).join('')}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />
      <p style="margin:0;font-size:16px;color:#0f172a;"><strong>Total : ${formatPrice(order.total)}</strong></p>
    </div>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#475569;">
      Nous préparons votre commande et vous tiendrons informé(e) de son avancement.
    </p>
  `;

  const fromAddress = process.env.MAIL_FROM || 'no-reply@mortech-solutions.ma';

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    html: buildEmailLayout({
      title: 'Panier validé',
      bodyHtml,
      ctaLabel: 'Voir mon profil',
      ctaUrl: `${baseUrl}/profil`,
      logoUrl
    })
  });
}

export async function sendQuotePdfEmail(transporter, order, baseUrl, logoUrl) {
  if (!isMailConfigured()) {
    console.warn('SMTP non configuré : impossible d’envoyer le devis par email.');
    return;
  }

  const to = order.user?.email;
  if (!to) return;

  const name = order.user?.name || 'client';
  const pdfBuffer = await generateQuotePdf(order);
  const subject = `Votre devis DEV-${order.id} — Mortech Solution`;
  const text = `Bonjour ${name},\n\nVotre demande de devis #${order.id} a été traitée et confirmée par notre équipe commerciale.\n\nVous trouverez votre devis au format PDF en pièce jointe.\n\nTotal du devis : ${formatPrice(order.total)}\n\nMerci,\nL’équipe Mortech Solution`;

  const bodyHtml = `
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#475569;">
      Bonjour <strong>${name}</strong>,<br/><br/>
      Votre demande de devis <strong>#DEV-${order.id}</strong> a été <strong style="color:#075cb8;">confirmée</strong> par notre équipe commerciale.
    </p>
    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#475569;">
      Vous trouverez votre devis détaillé au format <strong>PDF</strong> en pièce jointe de cet email.
    </p>
    <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:16px;color:#0f172a;"><strong>Montant total du devis : ${formatPrice(order.total)}</strong></p>
    </div>
  `;

  const fromAddress = process.env.MAIL_FROM || 'no-reply@mortech-solutions.ma';

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    html: buildEmailLayout({
      title: 'Votre devis est prêt',
      bodyHtml,
      ctaLabel: 'Accéder à la boutique',
      ctaUrl: baseUrl || '#',
      logoUrl
    }),
    attachments: [
      {
        filename: `devis-DEV-${order.id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
}
