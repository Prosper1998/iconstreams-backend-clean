const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env variables
dotenv.config();

// Connect DB
const connectDB = require('./config/db');
connectDB();

const app = express();

// CORS fix
const allowedOrigins = ['https://admin.iconstreams.com'];

app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser tools like Postman (null origin) + your frontend
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 🧠 IMPORTANT: Handle preflight for all routes
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/content', require('./routes/content'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Root route
app.get('/', (req, res) => {
  res.send('ICON Streaming backend');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
