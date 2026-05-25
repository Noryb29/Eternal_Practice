import { products } from "../server.js";

export const getAllProducts = (req, res) => {
    try {
        if (products.length > 0) {
            res.status(200).send({
                "status_code": 200,
                "products": products
            });
        } else {
            res.status(200).send({
                "status_code": 200,
                "products": []
            })
        }
    } catch (error) {
        console.log(error.toString())
    }
}

export const insertProduct = async (req, res) => {
    const { product_name, description, category, color, specs } = req.body

    try {
        if (!product_name || !description || !category || !color || !specs) {
            return res.status(400).send({
                "status_code": 400,
                "message": "All parameters must be filled"
            })
        }
        const newProduct = { product_name, description, category, color, specs }
        products.push(newProduct);
        res.status(200).send({
            "status_code": 200,
            "message": "Product Added Successfully",
            "product": newProduct,
        });
    } catch (error) {
        console.log(error.toString())
        res.status(500).send({
            "status_code": 500,
            "message": "Something Went Wrong",
            "error": "ERROR"
        })
    }
}