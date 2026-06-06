import crypto from 'crypto';
import prisma from '../src/db.js';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const staffAccounts = [
  {
    email: 'admin@mortech.com',
    name: 'Admin Gestionnaire',
    password: 'admin123',
    role: 'admin'
  },
  {
    email: 'sav@mortech.com',
    name: 'Technicien Support SAV',
    password: 'sav123',
    role: 'technicien'
  }
];

async function main() {
  for (const account of staffAccounts) {
    const hashedPassword = hashPassword(account.password);
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        password: hashedPassword,
        role: account.role
      },
      create: {
        email: account.email,
        name: account.name,
        password: hashedPassword,
        role: account.role
      }
    });
    console.log(`Compte ${account.role} prêt : ${user.email} / ${account.password}`);
  }

  const demoClient = await prisma.user.findFirst({ where: { role: 'user' } });
  if (demoClient) {
    const existingClaims = await prisma.claim.count();
    if (existingClaims === 0) {
      await prisma.claim.createMany({
        data: [
          {
            userId: demoClient.id,
            subject: 'Camera Hikvision defectueuse',
            description: 'La camera ne s allume plus apres installation.',
            status: 'PENDING'
          },
          {
            userId: demoClient.id,
            subject: 'Probleme NVR Dahua',
            description: 'Le NVR perd la connexion reseau regulierement.',
            status: 'ACCEPTED'
          }
        ]
      });
      console.log('Réclamations de démonstration créées.');
    }
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  prisma.$disconnect();
  process.exit(1);
});
