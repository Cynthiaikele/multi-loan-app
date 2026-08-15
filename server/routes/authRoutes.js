const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const { signupSchema, loginSchema } = require('../validators/authValidators');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.issues.map((issue) => issue.message) });
  }

  const { name, email, password, role } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already in use' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: role || 'user' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
  res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.issues.map((issue) => issue.message) });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
