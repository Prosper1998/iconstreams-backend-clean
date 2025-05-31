const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// ✅ Load .env variables
dotenv.config();

// ✅ MongoDB connection
const connectDB = require('./config/db');
connectDB();

const app = express();

// ✅ CORS config
const allowedOrigins = ['https://admin.iconstreams.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use('/api/content', require('./routes/content'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Root route
app.get('/', (req, res) => {
  res.send('ICON Streaming backend');
});

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
