const mongoose = require('mongoose');
require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));
const name = argv.name || argv.n || 'Admin User';
const email = (argv.email || argv.e || '').trim().toLowerCase();
const password = argv.password || argv.p;

if (!email || !password) {
  console.error('Usage: node createAdmin.js --email admin@example.com --password secret123 [--name "Admin"]');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const User = require('./models/User');

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('User already exists. Updating role to admin...');
      exists.role = 'admin';
      await exists.save();
      console.log('Updated existing user to admin:', email);
      process.exit(0);
    }

    const user = new User({ name, email, password, role: 'admin' });
    await user.save();
    console.log('Created admin user:', email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('DB connect error:', err.message);
  process.exit(1);
});
