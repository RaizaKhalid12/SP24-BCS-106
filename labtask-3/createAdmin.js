// ═══════════════════════════════════════════════════
//  createAdmin.js
//  Run once to seed an admin user:
//    node createAdmin.js
// ═══════════════════════════════════════════════════

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mazton';

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  console.log('✅  MongoDB connected');

  const email    = 'admin@mazton.com';
  const password = 'mazton2024';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`ℹ️   Admin already exists: ${email}`);
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({
    name:     'Mazton Admin',
    email,
    password: hashed,
    role:     'admin',
  });

  console.log('✅  Admin user created:');
  console.log(`    Email   : ${email}`);
  console.log(`    Password: ${password}`);
  console.log('    Role    : admin');
  await mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
