import crypto from 'crypto';
import prisma from '../src/db.js';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const adminAccount = {
  email: 'admin@mortech.com',
  name: 'Admin Gestionnaire',
  password: 'admin123',
  role: 'admin'
};

async function main() {
  const hashedPassword = hashPassword(adminAccount.password);
  const user = await prisma.user.upsert({
    where: { email: adminAccount.email },
    update: {
      name: adminAccount.name,
      password: hashedPassword,
      role: adminAccount.role
    },
    create: {
      email: adminAccount.email,
      name: adminAccount.name,
      password: hashedPassword,
      role: adminAccount.role
    }
  });
  console.log(`Compte admin prêt : ${user.email} / ${adminAccount.password}`);

  await prisma.user.deleteMany({ where: { role: 'technicien' } });

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
