const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

let products = [
    {
        id: 1,
        name: "iPhone 15",
        price: 1299,
        description: "Apple smartphone",
        imageUrl: "http://localhost:3000/images/iphone.png",
        category: "Phones",
        inStock: true
    },
    {
        id: 2,
        name: "Samsung TV",
        price: 899,
        description: "4K Smart TV",
        imageUrl: "http://localhost:3000/images/tv.jpg",
        category: "TVs",
        inStock: true
    },
    {
        id: 3,
        name: "iPad",
        price: 899,
        description: "Apple tablet",
        imageUrl: "http://localhost:3000/images/ipad.png",
        category: "Tablets",
        inStock: true
    },
    {
        id: 4,
        name: "PlayStation 5",
        price: 699,
        description: "Next-gen Sony gaming console",
        imageUrl: "http://localhost:3000/images/ps5.png",
        category: "Gaming",
        inStock: true
    }
];

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Best Buy Product Service is running"
    });
});

app.get("/products", (req, res) => {
    res.status(200).json(products);
});

app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((p) => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
});

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

app.put("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products[index] = { ...products[index], ...req.body };
    res.status(200).json(products[index]);
});

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