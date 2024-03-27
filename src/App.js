import React, { useState } from 'react';
import './App.css';

// Left Box Component
const LeftBox = ({ products, addToCart }) => {
  return (
    <div className="box">
      <h2>Available Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <span>{product.name} - ${product.price}</span>
            <button onClick={() => addToCart(product,true)}>-</button>
            <span>{product.count}</span>
            <button onClick={() => addToCart(product)}>+</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Right Box Component
const RightBox = ({ cart, removeFromCart }) => {
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="box">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>No Product added to the cart</p>
      ) : (
        <ul>
          {cart.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity}
              <button onClick={() => removeFromCart(item.id)}>-</button>
            </li>
          ))}
          <li>Total Price: ${totalPrice}</li>
        </ul>
      )}
    </div>
  );
};

// Main Component
const ShoppingCart = ({ products }) => {
  const [cart, setCart] = useState([]);
  const [availableProducts, setAvailableProducts] = useState(products.map(product => ({ ...product, count: 0 })));

  const addToCart = (product, remove = false) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1) {
      if (!remove) {
        updatedCart[existingItemIndex].quantity++;
        setAvailableProducts(
          availableProducts.map(item =>
            item.id === product.id ? { ...item, count: item.count - 1 } : { ...item }
          )
        );
      } else {
        updatedCart[existingItemIndex].quantity--;
        setAvailableProducts(
          availableProducts.map(item =>
            item.id === product.id ? { ...item, count: item.count + 1 } : { ...item }
          )
        );
      }
      if (updatedCart[existingItemIndex].quantity === 0) {
        updatedCart.splice(existingItemIndex, 1);
      }
    } else {
      updatedCart.push({ ...product, quantity: 1 });
      setAvailableProducts(
        availableProducts.map(item => (item.id === product.id ? { ...item, count: item.count - 1 } : { ...item }))
      );
    }
    setCart(updatedCart);
  };

  const removeFromCart = productId => {
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
    );
    setCart(updatedCart.filter(item => item.quantity > 0));
    const product = availableProducts.find(product => product.id === productId);
    if (product) {
      setAvailableProducts(
        availableProducts.map(item =>
          item.id === productId ? { ...item, count: item.count + 1 } : { ...item }
        )
      );
    }
  };

  return (
    <div className="container">
      <LeftBox products={availableProducts} addToCart={addToCart} />
      <RightBox cart={cart} removeFromCart={removeFromCart} />
    </div>
  );
};

// Sample Products
const Products = [
  { id: 1, name: 'Product-1', price: 100 },
  { id: 2, name: 'Product-2', price: 200 },
  { id: 3, name: 'Product-3', price: 300 },
];

// App Component
const App = () => {
  return (
    <div className="app">
      <ShoppingCart products={Products} />
    </div>
  );
};

export default App;
