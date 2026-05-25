import express from 'express'
import { getAllProducts, insertProduct } from '../controllers/productControllers.js';

export const productRoutes = express.Router();

productRoutes.get("/",getAllProducts) // GET ALL PRODUCTS
productRoutes.post("/",insertProduct) //POST PRODUCT
// productRoutes.delete("/:id") //DELETE PRODUCT
// productRoutes.put("/:id") //Update Product