import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import prisma from './db.js';
import { seedProducts } from './seedData.js';
import { sendCartValidatedEmail, sendQuotePdfEmail } from './orderEmails.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '2525', 10),
  secure: process.env.MAIL_SECURE === 'true',
  auth: process.env.MAIL_USER && process.env.MAIL_PASS ? {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  } : undefined
});

const baseUrl = process.env.APP_URL ? process.env.APP_URL.replace(/\/$/, '') : '';
const logoUrl = process.env.MORTECH_LOGO_URL || `${baseUrl}/assets/mortech-logo.png`;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function verifyRecaptchaToken(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn('RECAPTCHA_SECRET_KEY non configurée');
    return false;
  }

  const params = new URLSearchParams({
    secret,
    response: token
  });

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  const data = await response.json();
  return data.success === true;
}

async function sendWelcomeEmail(to, name) {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('SMTP non configuré : impossible d’envoyer l’email de bienvenue.');
    return;
  }

  const subject = 'Bienvenue sur Mortech Solution E-Commerce';
  const text = `Bonjour ${name || 'client'},\n\nVotre compte Mortech Solution E-Commerce a bien été créé.\nVous pouvez maintenant vous connecter et profiter de notre boutique en ligne.\n\nMerci et bienvenue,\nL’équipe Mortech Solution E-Commerce`;
  const html = `
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
                    <h1 style="margin:0 0 20px;font-size:28px;line-height:36px;color:#0f172a;">Bonjour ${name || 'client'},</h1>
                    <p style="margin:0 0 24px;font-size:16px;line-height:26px;color:#475569;">
                      Votre compte <strong>Mortech Solution E-Commerce</strong> a bien été créé. Vous pouvez maintenant vous connecter et profiter de notre boutique en ligne.
                    </p>
                    <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin-bottom:32px;">
                      <tr>
                        <td align="center">
                          <a href="${baseUrl || '#'}" style="display:inline-block;padding:14px 24px;background:#4f46e5;color:#ffffff;font-weight:600;border-radius:12px;text-decoration:none;font-size:16px;line-height:24px;">Accéder à la boutique</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0;font-size:16px;line-height:26px;color:#475569;">Merci et bienvenue,<br/>L’équipe Mortech Solution E-Commerce</p>
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

  const fromAddress = process.env.MAIL_FROM || 'no-reply@mortech-solutions.ma';

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    html
  });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- APIs ---

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running', timestamp: new Date() });
});

// Chatbot API using Gemini REST endpoint
app.post('/api/chatbot', async (req, res, next) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'missing_key',
        message: 'Clé API Gemini non configurée dans le fichier backend/.env. Veuillez ajouter GEMINI_API_KEY=votre_cle.'
      });
    }

    // Fetch all products from DB to feed the context
    const dbProducts = await prisma.product.findMany({
      select: {
        name: true,
        brand: true,
        category: true,
        subcategory: true,
        price: true,
        stock: true,
        description: true
      }
    });

    const productsListString = dbProducts.map(p => 
      `- ${p.name} (Marque: ${p.brand || 'N/A'}, Categorie: ${p.category || 'N/A'}, Prix: ${p.price} DH, Stock: ${p.stock > 0 ? `${p.stock} unites` : 'Rupture de stock'})\n  Description: ${p.description || 'N/A'}`
    ).join('\n');

    const systemInstructionText = `Vous êtes Mortech Bot, l'assistant virtuel officiel de "Mortech Solution" (une boutique e-commerce de vidéosurveillance, matériel réseau, et domotique au Maroc).
Votre rôle est d'assister les clients en répondant à leurs questions sur nos produits, en les conseillant sur leurs achats, en donnant des détails sur la qualité des produits, et en fournissant des conseils techniques ou astuces d'installation (par exemple pour configurer ou monter des caméras Dahua/Hikvision, des switchs PoE, ou des points d'accès Ruijie).

Voici des instructions clés pour vos réponses :
1. Langue : Répondez poliment en français (ou en arabe s'il s'agit de la langue du client).
2. Produits de la boutique : Utilisez exclusivement la liste ci-dessous pour parler des prix, de la disponibilité, des marques ou des détails spécifiques des produits. Ne dites pas que nous vendons des produits qui ne sont pas dans la liste.
3. Disponibilité/Stock : Si un produit a un stock de 0, il est en rupture de stock. Conseillez gentiment au client de contacter notre équipe commerciale par le formulaire de contact ou par WhatsApp pour en savoir plus ou demander un devis.
4. Qualité et Choix : Expliquez la qualité professionnelle de nos marques (Dahua, Hikvision, Ruijie). Pour Hikvision/Dahua, ce sont des leaders mondiaux de la vidéosurveillance avec une qualité d'image exceptionnelle (vision nocturne, détection intelligente).
5. Astuces d'installation : Donnez des conseils pratiques et professionnels. Par exemple :
   - Pour les caméras IP : Mentionnez l'utilisation des logiciels constructeurs (Dahua ConfigTool, Hikvision SADP Tool) pour détecter et initialiser l'adresse IP de la caméra sur le réseau local. Expliquez qu'il faut brancher la caméra sur un Switch PoE ou un enregistreur NVR PoE pour l'alimentation et la transmission de données via un seul câble RJ45.
   - Pour les caméras analogiques : Expliquez qu'elles nécessitent un enregistreur DVR et des câbles coaxiaux KX6 pour la transmission du signal vidéo et de l'alimentation.
   - Pour les points d'accès (ex. Ruijie) : Indiquez de télécharger l'application Ruijie Cloud sur smartphone pour une configuration rapide et gratuite via le cloud.
6. Ton : Professionnel, serviable, technique mais simple d'accès, chaleureux.

Liste des produits actuellement en vente chez Mortech Solution :
${productsListString}`;

    // Map frontend messages roles (user -> user, bot/assistant -> model)
    const geminiContents = messages.map(msg => {
      const role = msg.role === 'user' ? 'user' : 'model';
      let parts = [];
      if (typeof msg.parts === 'string') {
        parts = [{ text: msg.parts }];
      } else if (Array.isArray(msg.parts)) {
        parts = msg.parts.map(p => typeof p === 'string' ? { text: p } : p);
      } else {
        parts = [{ text: '' }];
      }
      return { role, parts };
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: geminiContents,
        systemInstruction: {
          parts: [{ text: systemInstructionText }]
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', errText);
      return res.status(502).json({ error: 'Failed to generate response from Gemini API', details: errText });
    }

    const geminiData = await geminiResponse.json();
    const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      return res.status(502).json({ error: 'Invalid response structure from Gemini API', data: geminiData });
    }

    res.json({ reply: replyText });
  } catch (error) {
    next(error);
  }
});

// Auth APIs
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, company, email, phone, password, recaptchaToken } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Validation reCAPTCHA requise' });
    }

    const recaptchaValid = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Échec de la validation reCAPTCHA' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        company,
        email,
        phone,
        password: hashedPassword,
        role: 'user'
      }
    });

    try {
      await sendWelcomeEmail(email, name);
    } catch (mailError) {
      console.error('Erreur lors de l’envoi de l’email de bienvenue :', mailError);
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password, recaptchaToken } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Validation reCAPTCHA requise' });
    }

    const recaptchaValid = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Échec de la validation reCAPTCHA' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
});

app.post('/api/verify-recaptcha', async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Validation reCAPTCHA requise' });
    }

    const recaptchaValid = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Échec de la validation reCAPTCHA' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

async function sendContactEmail({ name, email, subject, message }) {
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('SMTP non configuré : impossible d’envoyer le message de contact.');
    return;
  }

  const fromAddress = process.env.MAIL_FROM || 'no-reply@mortech-solutions.ma';
  const toAddress = 'contact@mortech-solutions.ma';
  const finalSubject = subject ? `Contact formulaire: ${subject}` : 'Contact formulaire : message sans sujet';

  const html = `
    <html>
      <body style="font-family: Inter, system-ui, sans-serif; color: #111827;">
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${name || 'Non renseigné'}</p>
        <p><strong>Email :</strong> ${email || 'Non renseigné'}</p>
        <p><strong>Sujet :</strong> ${subject || 'Non renseigné'}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap;">${message || ''}</p>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: fromAddress,
    to: toAddress,
    replyTo: email || fromAddress,
    subject: finalSubject,
    text: `Nom: ${name || 'Non renseigné'}\nEmail: ${email || 'Non renseigné'}\nSujet: ${subject || 'Non renseigné'}\n\n${message || ''}`,
    html
  });
}

app.post('/api/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message, recaptchaToken } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Le nom, l’email et le message sont obligatoires.' });
    }

    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Validation reCAPTCHA requise' });
    }

    const recaptchaValid = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Échec de la validation reCAPTCHA' });
    }

    await sendContactEmail({ name, email, subject, message });
    res.json({ success: true, message: 'Votre message a bien été envoyé.' });
  } catch (error) {
    next(error);
  }
});

// 2. Users CRUD
// Get all users
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { orders: true }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Create a new user
app.post('/api/users', async (req, res, next) => {
  try {
    const { email, name, role } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await prisma.user.create({
      data: { email, name, role }
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(error);
  }
});

// Update a user
app.patch('/api/users/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { name, email, phone, company } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: 'No data provided for update' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(error);
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    await prisma.user.delete({
      where: { id }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
});

// 3. Products CRUD
// Get all products
app.get('/api/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Create a new product
app.post('/api/products', async (req, res, next) => {
  try {
    const { name, description, brand, category, subcategory, badge, price, stock, imageUrl } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }
    const product = await prisma.product.create({
      data: {
        name,
        description,
        brand,
        category,
        subcategory,
        badge,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        imageUrl
      }
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    await prisma.product.delete({
      where: { id }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    next(error);
  }
});

// 4. Orders & Quotes CRUD
app.get('/api/orders', async (req, res, next) => {
  try {
    const { userId } = req.query;
    const where = userId ? { userId: parseInt(userId, 10) } : {};
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, company: true, phone: true } },
        orderItems: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/orders/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (isNaN(id) || !status) {
      return res.status(400).json({ error: 'Invalid order ID or status' });
    }

    const previousOrder = await prisma.order.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!previousOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: { include: { product: true } }
      }
    });

    if (status === 'CONFIRMED' && previousOrder.status !== 'CONFIRMED') {
      try {
        if (previousOrder.status === 'PENDING') {
          await sendCartValidatedEmail(transporter, order, baseUrl, logoUrl);
        } else if (previousOrder.status === 'DEVIS') {
          await sendQuotePdfEmail(transporter, order, baseUrl, logoUrl);
        }
      } catch (mailError) {
        console.error('Erreur lors de l’envoi de l’email client :', mailError);
      }
    }

    res.json(order);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    next(error);
  }
});

app.post('/api/orders', async (req, res, next) => {
  try {
    const { userId, items, total, status = 'PENDING', recaptchaToken } = req.body;
    if (!userId || !items || !items.length) {
      return res.status(400).json({ error: 'User ID and items are required' });
    }

    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Validation reCAPTCHA requise' });
    }

    const recaptchaValid = await verifyRecaptchaToken(recaptchaToken);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Échec de la validation reCAPTCHA' });
    }

    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        total: parseFloat(total),
        status,
        orderItems: {
          create: items.map(item => ({
            productId: parseInt(item.id),
            quantity: parseInt(item.qty),
            price: parseFloat(item.price)
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    res.status(201).json({ message: 'Order/Quote created successfully', order });
  } catch (error) {
    next(error);
  }
});

// 5. Claims (Réclamations SAV)
app.get('/api/claims', async (req, res, next) => {
  try {
    const claims = await prisma.claim.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(claims);
  } catch (error) {
    next(error);
  }
});

app.post('/api/claims', async (req, res, next) => {
  try {
    const { userId, subject, description } = req.body;
    if (!userId || !subject) {
      return res.status(400).json({ error: 'User ID and subject are required' });
    }
    const claim = await prisma.claim.create({
      data: {
        userId: parseInt(userId),
        subject,
        description
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
    res.status(201).json(claim);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/claims/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (isNaN(id) || !status) {
      return res.status(400).json({ error: 'Invalid claim ID or status' });
    }
    const claim = await prisma.claim.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
    res.json(claim);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Claim not found' });
    }
    next(error);
  }
});

// 6. Admin statistics
app.get('/api/admin/stats', async (req, res, next) => {
  try {
    const [usersCount, productsCount, ordersCount, quotesCount, claimsCount, lowStockCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count({ where: { status: { not: 'DEVIS' } } }),
      prisma.order.count({ where: { status: 'DEVIS' } }),
      prisma.claim.count(),
      prisma.product.count({ where: { stock: { lte: 5 } } })
    ]);

    const revenue = await prisma.order.aggregate({
      where: { status: { in: ['CONFIRMED', 'DELIVERED', 'COMPLETED'] } },
      _sum: { total: true }
    });

    res.json({
      usersCount,
      productsCount,
      ordersCount,
      quotesCount,
      claimsCount,
      lowStockCount,
      revenue: revenue._sum.total || 0
    });
  } catch (error) {
    next(error);
  }
});

// Seed sample data for testing
app.post('/api/seed', async (req, res, next) => {
  try {
    const products = [];
    for (const p of seedProducts) {
      const existing = await prisma.product.findFirst({ where: { name: p.name } });
      if (!existing) {
        const product = await prisma.product.create({ data: p });
        products.push(product);
      }
    }

    const adminPassword = hashPassword('admin123');
    let user = await prisma.user.findUnique({ where: { email: 'admin@mortech.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@mortech.com',
          name: 'Admin Gestionnaire',
          password: adminPassword,
          role: 'admin'
        }
      });
    } else if (!user.password) {
      user = await prisma.user.update({
        where: { email: 'admin@mortech.com' },
        data: { password: adminPassword, role: 'admin', name: 'Admin Gestionnaire' }
      });
    }

    res.json({ message: 'Database seeded successfully', user, productsCreated: products.length });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
