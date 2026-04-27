import bcrypt from 'bcryptjs';
import { config, requireConfig } from './config.js';
import { connectDb } from './db.js';
import { User } from './models/User.js';

async function run() {
  requireConfig();
  await connectDb();

  const adminEmail = 'admin@cityresolve.local';
  const citizenEmail = 'citizen@cityresolve.local';

  const adminPassword = 'Admin123!';
  const citizenPassword = 'Citizen123!';

  const adminHash = await bcrypt.hash(adminPassword, 12);
  const citizenHash = await bcrypt.hash(citizenPassword, 12);

  await User.updateOne(
    { email: adminEmail },
    {
      $setOnInsert: {
        email: adminEmail,
        name: 'City Admin',
        role: 'admin',
        passwordHash: adminHash,
        points: 500,
        level: 5,
        badges: ['founder'],
      },
    },
    { upsert: true }
  );

  await User.updateOne(
    { email: citizenEmail },
    {
      $setOnInsert: {
        email: citizenEmail,
        name: 'Demo Citizen',
        role: 'citizen',
        passwordHash: citizenHash,
        points: 120,
        level: 2,
        badges: [],
      },
    },
    { upsert: true }
  );

  // eslint-disable-next-line no-console
  console.log('Seed complete. Demo accounts:');
  // eslint-disable-next-line no-console
  console.log(`Admin:   ${adminEmail} / ${adminPassword}`);
  // eslint-disable-next-line no-console
  console.log(`Citizen: ${citizenEmail} / ${citizenPassword}`);

  process.exit(0);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
