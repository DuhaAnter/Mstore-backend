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
const userRoutes = require ('./routes/users.js');
const categoryRoutes =require('./routes/categories.js');
const subCategoryRoutes =require('./routes/subCategories.js');
// main route
app.get('/', (req, res) => {
  res.json({ message: 'M-Store Backend is running' });
});
// Use routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/categories' , categoryRoutes);
app.use('/subcategories' , subCategoryRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});