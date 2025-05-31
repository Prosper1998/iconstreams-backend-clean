const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const connectDB = require('./config/db');
connectDB();

const app = express();

// ✅ CORS Configuration
const allowedOrigins = ['https://admin.iconstreams.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Handle preflight

app.use(express.json());

// ✅ API Routes
app.use('/api/content', require('./routes/content'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// ✅ Root
app.get('/', (req, res) => {
  res.send('ICON Streaming backend');
});

// ✅ CORS fallback — critical for OPTIONS requests not matching routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://admin.iconstreams.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
