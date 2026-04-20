const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

// Temporary in-memory data
let products = [
    {
        id: 1,
        name: "iPhone 15",
        price: 1299,
        description: "Apple smartphone",
        imageUrl: "https://example.com/iphone15.jpg",
        category: "Phones",
        inStock: true
    },
    {
        id: 2,
        name: "Samsung TV",
        price: 899,
        description: "4K Smart TV",
        imageUrl: "https://example.com/tv.jpg",
        category: "TVs",
        inStock: true
    }
];

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Best Buy Product Service is running"
    });
});

// Get all products
app.get("/products", (req, res) => {
    res.status(200).json(products);
});

// Get one product
app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((p) => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
});

// Create product
app.post("/products", (req, res) => {
    const { name, price, description, imageUrl, category, inStock } = req.body;

    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        name,
        price,
        description,
        imageUrl,
        category,
        inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Update product
app.put("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products[index] = { ...products[index], ...req.body };
    res.status(200).json(products[index]);
});

// Delete product
app.delete("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const deletedProduct = products[index];
    products.splice(index, 1);

    res.status(200).json({
        message: "Product deleted successfully",
        product: deletedProduct
    });
});

app.listen(PORT, () => {
    console.log(`Product Service is running on port ${PORT}`);
});