const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Sample product data
let products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', image: '💻' },
    { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Electronics', image: '🖱️' },
    { id: 3, name: 'USB-C Cable', price: 9.99, category: 'Accessories', image: '🔌' },
    { id: 4, name: 'Monitor', price: 299.99, category: 'Electronics', image: '🖥️' },
    { id: 5, name: 'Keyboard', price: 79.99, category: 'Electronics', image: '⌨️' }
];

let cart = [];

// GET - Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// GET - Get cart items
app.get('/api/cart', (req, res) => {
    res.json(cart);
});

// POST - Add product to cart
app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity || 1;
    } else {
        cart.push({ ...product, quantity: quantity || 1 });
    }

    res.json({ success: true, cart });
});

// PUT - Update cart item quantity
app.put('/api/cart/:productId', (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cartItem = cart.find(item => item.id === parseInt(productId));
    if (!cartItem) {
        return res.status(404).json({ error: 'Item not in cart' });
    }

    cartItem.quantity = quantity;
    res.json({ success: true, cart });
});

// DELETE - Remove item from cart
app.delete('/api/cart/:productId', (req, res) => {
    const { productId } = req.params;
    
    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== parseInt(productId));

    if (cart.length === initialLength) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ success: true, message: 'Item removed from cart', cart });
});

// Checkout endpoint
app.post('/api/checkout', (req, res) => {
    if (cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = Math.floor(Math.random() * 10000);
    
    res.json({ 
        success: true, 
        message: 'Order placed successfully!',
        orderNumber,
        total: total.toFixed(2),
        items: cart.length
    });

    cart = [];
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Store API running at http://localhost:${PORT}`);
});
