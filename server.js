const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || "mongodb://mongodb:27017/bestbuy";

mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    category: String,
    inStock: Boolean
});

const Product = mongoose.model("Product", productSchema);
// let products = [
//     {
//         id: 1,
//         name: "iPhone 15",
//         price: 1299,
//         description: "Apple smartphone",
//         imageUrl: "http://20.14.61.92/images/iphone.png",
//         category: "Phones",
//         inStock: true
//     },
//     {
//         id: 2,
//         name: "Samsung TV",
//         price: 899,
//         description: "4K Smart TV",
//         imageUrl: "http://20.14.61.92/images/tv.jpg",
//         category: "TVs",
//         inStock: true
//     },
//     {
//         id: 3,
//         name: "iPad",
//         price: 899,
//         description: "Apple tablet",
//         imageUrl: "http://20.14.61.92/images/ipad.png",
//         category: "Tablets",
//         inStock: true
//     },
//     {
//         id: 4,
//         name: "PlayStation 5",
//         price: 699,
//         description: "Next-gen Sony gaming console",
//         imageUrl: "http://20.14.61.92/images/ps5.png",
//         category: "Gaming",
//         inStock: true
//     }
// ];

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Best Buy Product Service is running"
    });
});

app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
});

app.post("/products", async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

app.put("/products/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
});

app.delete("/products/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});