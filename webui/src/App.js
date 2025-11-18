import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const BASE = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${BASE}/api/products`);
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCart = async () => {
        try {
            const { data } = await axios.get(`${BASE}/api/cart`);
            setCart(data);
        } catch (err) {
            console.error(err);
        }
    };

    const addToCart = async (productId) => {
        try {
            await axios.post(`${BASE}/api/cart`, { productId, quantity: 1 });
            await fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            if (quantity <= 0) {
                await removeFromCart(productId);
                return;
            }
            await axios.put(`${BASE}/api/cart/${productId}`, { quantity });
            await fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`${BASE}/api/cart/${productId}`);
            await fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const checkout = async () => {
        try {
            await axios.post(`${BASE}/api/checkout`);
            setCart([]);
            setShowCart(false);
        } catch (err) {
            console.error(err);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="App">
            <header className="header">
                <h1>🛍️ TechStore</h1>
                <button className="cart-button" onClick={() => setShowCart(!showCart)}>
                    🛒 Cart ({cart.length})
                </button>
            </header>

            {!showCart ? (
                <main className="main">
                    <section className="splash">
                        <h2>Welcome to TechStore</h2>
                        <p>Your One-Stop Shop for Electronics & Accessories</p>
                    </section>

                    <section className="about">
                        <h2>About Us</h2>
                        <p>
                            Innovator and tech-driven problem solver helping organizations adopt
                            transformative solutions.
                        </p>
                    </section>

                    <section className="products">
                        <h2>Featured Products</h2>
                        <div className="product-grid">
                            {products.map((product) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">{product.image}</div>
                                    <h3>{product.name}</h3>
                                    <p className="category">{product.category}</p>
                                    <p className="price">${product.price}</p>
                                    <button className="add-btn" onClick={() => addToCart(product.id)}>
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            ) : (
                <div className="cart-view">
                    <h2>Shopping Cart</h2>
                    {cart.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <span className="item-name">{item.image} {item.name}</span>
                                        <div className="quantity-control">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 0)}
                                            />
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-total">
                                <h3>Total: ${cartTotal.toFixed(2)}</h3>
                                <button className="checkout-btn" onClick={checkout}>
                                    Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
