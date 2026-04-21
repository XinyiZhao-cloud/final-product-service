/**
 * CST8915 Final Project - Product Service
 *
 * Author: Xinyi Zhao
 * Course: CST8915 Full-stack Cloud-native Development
 * Semester: Winter 2026
 *
 * Description:
 * This service manages product data for the Best Buy demo application.
 * It provides RESTful APIs to create, retrieve, update, and delete products.
 *
 * Architecture Role:
 * - Backend microservice deployed on Azure Kubernetes Service (AKS)
 * - Stores product data using MongoDB (persistent storage)
 * - Serves data to store-front and store-admin services
 *
 * Features:
 * - Retrieve all products
 * - Retrieve a single product by ID
 * - Add new products (admin)
 * - Update existing products
 * - Delete products
 *
 * Note:
 * - Uses MongoDB for persistent storage
 * - Image URLs are stored as part of product data
 * - Core data service for the entire application
 */
const express = require("express");
const cors = require("cors");

const app = express();

// ==============================
// Middleware
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// Configuration
// ==============================
const PORT = 3001;

// MongoDB connection string (from Kubernetes env)
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongodb:27017/bestbuy";

// ==============================
// MongoDB Connection
// ==============================
mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// ==============================
// Schema & Model
// ==============================
// Defines structure of product documents in MongoDB
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

// ==============================
// Health Check
// ==============================
// Used to verify service is running
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Product Service is updated via CI/CD pipeline and running successfully!"
    });
});

// ==============================
// Get All Products
// ==============================
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// ==============================
// Get Product by ID (Legacy)
// ==============================
// NOTE: This uses old in-memory logic and is not used
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

// ==============================
// Create Product
// ==============================
// Adds a new product to MongoDB
app.post("/products", async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

// ==============================
// Update Product (Legacy)
// ==============================
// NOTE: Uses in-memory array (not active)
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

// ==============================
// Delete Product
// ==============================
// Removes a product from MongoDB using _id
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

// ==============================
// Start Server
// ==============================
app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});