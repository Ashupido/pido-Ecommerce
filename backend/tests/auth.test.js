const test = require('node:test');
const assert = require('assert');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pido';

const User = require('../models/User');
const authRouter = require('../routes/authRoutes');
const { createToken } = require('../controllers/authController');

const registerHandler = authRouter.stack.find((layer) => layer.route?.path === '/register')?.route?.stack?.[0]?.handle;
const loginHandler = authRouter.stack.find((layer) => layer.route?.path === '/login')?.route?.stack?.[0]?.handle;

function createRes() {
  let statusCode = 200;
  let payload;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      payload = data;
      return this;
    },
    get statusCode() {
      return statusCode;
    },
    get payload() {
      return payload;
    },
  };
}

test('register and login work with mixed-case email addresses', async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = `AuthTest.${Date.now()}@Example.COM`;
  const password = 'secret123';

  const registerRes = createRes();
  await registerHandler({ body: { name: 'Auth Tester', email, password } }, registerRes);
  assert.strictEqual(registerRes.statusCode, 201, 'register should succeed');
  assert.ok(registerRes.payload?.token, 'register should return a token');
  assert.ok(!registerRes.payload?.user?.password, 'register should not expose the password');

  const loginRes = createRes();
  await loginHandler({ body: { email: email.toLowerCase(), password } }, loginRes);
  assert.strictEqual(loginRes.statusCode, 200, 'login should succeed');
  assert.ok(loginRes.payload?.token, 'login should return a token');
  assert.ok(!loginRes.payload?.user?.password, 'login should not expose the password');

  await User.deleteOne({ email: email.toLowerCase() });
  await mongoose.disconnect();
});

test('createToken includes userId and role in the payload', () => {
  const token = createToken({ _id: 'user-id', role: 'seller' });
  const payload = jwt.decode(token);

  assert.strictEqual(payload.userId, 'user-id');
  assert.strictEqual(payload.role, 'seller');
});
