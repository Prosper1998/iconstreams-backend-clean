const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// ✅ Load environment variables first
dotenv.config();

// ✅ Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

const app = express();

// ✅ CORS Configuration
const allowedOrigins = ['https://admin.iconstreams.com']; // Add other domains if needed
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use('/api/content', require('./routes/content'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.send('ICON Streaming backend');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
