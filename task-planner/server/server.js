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

// CORS configuration to allow Vercel client
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://task-planner-app-one.vercel.app',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean),
  credentials: true,
}));

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
