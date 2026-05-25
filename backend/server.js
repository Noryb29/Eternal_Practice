import cors from 'cors'
import express, { json, urlencoded } from 'express'
import { productRoutes } from './routes/productRoutes.js';

const app = express();


app.use(json());

app.use(urlencoded({
    extended: true
}));

app.use('/api/products',productRoutes)
app.use(cors())

export const products = [];

app.listen(3000, () =>{
    console.log("Server is running at http://localhost:3000")
})