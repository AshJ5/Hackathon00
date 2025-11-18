import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const fetchProducts = () => {
        axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/api/products`)
            .then(res => setProducts(res.data));
    };

    const fetchCart = () => {
        axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/api/cart`)
            .then(res => setCart(res.data))
            .catch(err => console.error(err));
    };

    const addToCart = (productId) => {
        axios.post(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/api/cart`, { productId, quantity: 1 })
            .then(() => {
                fetchCart();
            })
            .catch(err => console.error(err));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            axios.put(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/api/cart/${productId}`, { quantity })
                .then(() => fetchCart())
                .catch(err => console.error(err));
        }
    };

    const removeFromCart = (productId) => {
        axios.delete(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/api/cart/${productId}`)
            .then(() => {
                fetchCart();
            })
            .catch(err => console.error(err));
    };

    const checkout = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/api/checkout`)
            .then(res => {
                setCart([]);
                setShowCart(false);
            })
            .catch(err => console.error(err));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="App">
            {/* Header */}
            <header className="header">
                <h1>🛍️ TechStore</h1>
                <button className="cart-button" onClick={() => setShowCart(!showCart)}>
                    🛒 Cart ({cart.length})
                </button>
            </header>

            {/* Main Content */}
            {!showCart ? (
                <div className="main">
                    {/* Splash Section */}
                    <section className="splash">
                        <h2>Welcome to TechStore</h2>
                        <p>Your One-Stop Shop for Electronics & Accessories</p>
                        <p>🚀 Fast Shipping | ✨ Quality Products | 💯 Best Prices</p>
                    </section>

                    {/* About Section */}
                    <section className="about">
                        <h2>About Us</h2>
                        <p>
                            TechStore provides a curated selection of premium tech products and accessories.
                            We believe in making quality technology accessible and affordable for everyone.
                        </p>
                    </section>

                    {/* Products Section - Proof of Concept */}
                    <section className="products">
                        <h2>Featured Products</h2>
                        <div className="product-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">{product.image}</div>
                                    <h3>{product.name}</h3>
                                    <p className="category">{product.category}</p>
                                    <p className="price">${product.price}</p>
                                    <button 
                                        className="add-btn"
                                        onClick={() => addToCart(product.id)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                /* Cart View */
                <div className="cart-view">
                    <h2>Shopping Cart</h2>
                    {cart.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <span className="item-name">{item.image} {item.name}</span>
                                        <div className="quantity-control">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <input 
                                                type="number" 
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            />
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id)}
                                        >
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
