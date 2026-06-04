import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import prisma from './db.js';
import { seedProducts } from './seedData.js';

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
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
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
app.post('/api/orders', async (req, res, next) => {
  try {
    const { userId, items, total, status = 'PENDING' } = req.body;
    if (!userId || !items || !items.length) {
      return res.status(400).json({ error: 'User ID and items are required' });
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

    let user = await prisma.user.findUnique({ where: { email: 'admin@mortech.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@mortech.com',
          name: 'Admin User',
          role: 'admin'
        }
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
