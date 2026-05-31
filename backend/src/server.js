import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import prisma from './db.js';
import { seedProducts } from './seedData.js';

dotenv.config();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const transporterOptions = {
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
};

if (process.env.SMTP_SERVICE) {
  transporterOptions.service = process.env.SMTP_SERVICE;
} else {
  transporterOptions.host = process.env.SMTP_HOST;
  transporterOptions.port = parseInt(process.env.SMTP_PORT || '587', 10);
  transporterOptions.secure = process.env.SMTP_SECURE === 'true';
}

const mailTransporter = nodemailer.createTransport(transporterOptions);

async function sendWelcomeEmail(to, name) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP non configuré : impossible d’envoyer l’email de bienvenue.');
    return;
  }

  const subject = 'Bienvenue sur Mortech Solution E-Commerce';
  const text = `Bonjour ${name || 'client'},\n\nVotre compte Mortech Solution E-Commerce a bien été créé.\nVous pouvez maintenant vous connecter et profiter de notre boutique en ligne.\n\nMerci et bienvenue,\nL’équipe Mortech Solution E-Commerce`;
  const html = `
    <p>Bonjour ${name || 'client'},</p>
    <p>Votre compte <strong>Mortech Solution E-Commerce</strong> a bien été créé.</p>
    <p>Vous pouvez maintenant vous connecter et profiter de notre boutique en ligne.</p>
    <p>Merci et bienvenue,<br/>L’équipe Mortech Solution E-Commerce</p>
  `;

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@mortech-solutions.ma';

  await mailTransporter.sendMail({
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
    const { name, company, email, phone, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
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
