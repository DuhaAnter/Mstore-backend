const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();
// const PORT = process.env.PORT ;

// app.use(cors({
//   origin: 'http://localhost:5173', // Your exact React/Vite frontend URL (no trailing slash!)
//   credentials: true                // Allowed to receive cookies from the frontend
// }));
app.use(express.json());
app.use(cookieParser());
// Import routes
// const productRoutes = require('./routes/products');
// const userRoutes = require ('./routes/users.js');
// const categoryRoutes =require('./routes/categories.js');
// const subCategoryRoutes =require('./routes/subCategories.js');
// const cartRoutes = require('./routes/cart.js');
// const orderRoutes = require('./routes/order.js');
// const couponRoutes = require ('./routes/coupon.js');
// const reviewRoutes = require('./routes/review.js');
// main route
app.get('/', (req, res) => {
  res.json({ message: 'M-Store Backend is running' });
});
// Use routes
// app.use('/products', productRoutes);
// app.use('/users', userRoutes);
// app.use('/categories' , categoryRoutes);
// app.use('/subcategories' , subCategoryRoutes);
// app.use('/cart',cartRoutes);
// app.use('/order',orderRoutes);
// app.use('/coupons',couponRoutes);
// app.use('/reviews',reviewRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// module.exports= app;