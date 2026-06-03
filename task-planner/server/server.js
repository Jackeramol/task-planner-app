const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const uploadRoutes = require('./routes/upload');

const app = express();

// Robust CORS handling: allowlisted origins and preflight handling
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://task-planner-app-one.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Ensure preflight requests are handled for all routes
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

// Fallback middleware to set CORS headers (covers cases where cors() might not run)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Task Planner API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
