const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// ✅ Load environment variables first
dotenv.config();

const connectDB = require('./config/db');

// ✅ Connect to MongoDB using the loaded MONGO_URI
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/content', require('./routes/content'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.send('ICON Streaming backend');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
