const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config({ override: true });

const path = require('path');

const app = express();

// Security Middleware
// Set security HTTP headers, allowing images from Cloudinary
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows cross-origin image loading
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "res.cloudinary.com"], // Allow cloudinary images
      scriptSrc: ["'self'", "'unsafe-inline'"], // Might be needed depending on frontend setup
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      connectSrc: ["'self'", "res.cloudinary.com"],
    },
  },
}));

// Global Rate Limiting: Max 150 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 150,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false,
});
app.use('/api', limiter); // Apply to all API routes



// Configure CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json({ limit: '10kb' })); // Limit body payload size
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Portfolio Backend API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
