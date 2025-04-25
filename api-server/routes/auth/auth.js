const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email } });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, userEmail: user.email, session: uuidv4()  }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

module.exports = router;
