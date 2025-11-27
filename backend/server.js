const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');
const pollRoutes=require('./routes/polls');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


//routes 
app.use('./api/polls',pollRoutes);

// Basic Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});