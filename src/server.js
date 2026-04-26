const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

app.use(cors());
app.use(express.json());
// Import routes
const productRoutes = require('./routes/products');
// main route
app.get('/', (req, res) => {
  res.json({ message: 'M-Store Backend is running' });
});
// Use routes
app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});