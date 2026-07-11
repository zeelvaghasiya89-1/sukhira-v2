const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup CORS with Credentials support for HTTP-Only Cookie Sessions
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.STORE_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow local development and configured domains
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve local mock R2 image uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Import API sub-routers
const storeRoutes = require('./src/routes/store');
const adminRoutes = require('./src/routes/admin');

app.use('/api/store', storeRoutes);
app.use('/api/admin', adminRoutes);

// Welcome / API Status endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Sukhira Wellness Backend API Server is running!",
    status: "healthy",
    timestamp: new Date()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`=== Sukhira Wellness Backend Booted ===`);
  console.log(`Server listening on port ${PORT}`);
});
