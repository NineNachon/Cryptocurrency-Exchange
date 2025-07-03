// server.js

const express = require('express');

// --- Corrected Paths ---
const db = require('./src/models'); 
const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get('/api', (req, res) => res.send('Welcome to P2P Exchange API'));
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await db.sequelize.authenticate();
    console.log('Database connected!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});