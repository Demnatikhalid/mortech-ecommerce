import PDFDocument from 'pdfkit';

function formatPrice(amount) {
  return `${Number(amount).toFixed(2)} MAD`;
}

export function generateQuotePdf(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const clientName = order.user?.name || 'Client';
    const clientEmail = order.user?.email || '';
    const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR');

    doc.fontSize(24).fillColor('#0f172a').text('Mortech Solution', { align: 'center' });
    doc.fontSize(14).fillColor('#475569').text('Devis commercial', { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(10).fillColor('#64748b');
    doc.text(`Devis N° DEV-${order.id}`, { align: 'right' });
    doc.text(`Date : ${orderDate}`, { align: 'right' });
    doc.moveDown(2);

    doc.fontSize(12).fillColor('#0f172a').text('Informations client', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#334155');
    doc.text(`Nom : ${clientName}`);
    doc.text(`Email : ${clientEmail}`);
    doc.moveDown(2);

    const tableTop = doc.y;
    const colX = { product: 50, qty: 320, price: 380, total: 460 };

    doc.fontSize(11).fillColor('#0f172a');
    doc.text('Produit', colX.product, tableTop);
    doc.text('Qté', colX.qty, tableTop);
    doc.text('P.U.', colX.price, tableTop);
    doc.text('Total', colX.total, tableTop);
    doc.moveDown(0.5);
    doc.strokeColor('#e2e8f0').moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(10).fillColor('#334155');
    for (const item of order.orderItems) {
      const lineTotal = item.price * item.quantity;
      const productName = item.product?.name || `Produit #${item.productId}`;
      const y = doc.y;

      doc.text(productName, colX.product, y, { width: 250 });
      doc.text(String(item.quantity), colX.qty, y);
      doc.text(formatPrice(item.price), colX.price, y);
      doc.text(formatPrice(lineTotal), colX.total, y);
      doc.moveDown(1.2);
    }

    doc.strokeColor('#e2e8f0').moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    doc.fontSize(12).fillColor('#0f172a');
    doc.text(`Total TTC : ${formatPrice(order.total)}`, { align: 'right' });
    doc.moveDown(3);

    doc.fontSize(9).fillColor('#94a3b8');
    doc.text('Ce devis est valable 30 jours à compter de sa date d’émission.', { align: 'center' });
    doc.text('Mortech Solution · 470 Noor Ave STE B #1148, South San Francisco, CA 94080', { align: 'center' });

    doc.end();
  });
}
