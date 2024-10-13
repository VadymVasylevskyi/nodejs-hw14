import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/categories', async (req, res) => {
    try {
      const { name } = req.body;
      const newCategory = new Category({ name });
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

  app.post('/products', async (req, res) => {
    try {
      const { name, price, categoryId } = req.body;
      const category = await Category.findById(categoryId);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      
      const newProduct = new Product({ name, price, category: categoryId });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get('/products', async (req, res) => {
    try {
      const products = await Product.find().populate('category');
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

const startServer = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Успешное подключение к БД: ${conn.connection.host}`);
    app.listen(3000, () => {
      console.log('Сервер запущен на 3000-м порту');
    });
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    process.exit(1);
  }
};

startServer();
  