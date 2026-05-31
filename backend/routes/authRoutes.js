const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token directly from .env variables
router.post('/login', async (req, res) => {
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

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecret',
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
