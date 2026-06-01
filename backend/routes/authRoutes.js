const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Strict Rate Limiting for Login to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased limit for development
  message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token directly from .env variables
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check against .env variables instead of a database
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: 'admin' // Since there's only one user, we don't need a DB ID
      }
    };

    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
