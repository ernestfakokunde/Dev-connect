import { useState } from 'react';

const Marketplace = () => {
 
  const [cart, setCart] = useState([]);

  const products = [
    { id: 1, name: 'Wireless Headphones', price: 59.99, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Smart Watch', price: 79.99, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Mechanical Keyboard', price: 99.99, image: 'https://via.placeholder.com/150' },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };


  return (
    <section className="min-h-screen py-12 px-6 md:px-10 relative">
 <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-[var(--color-text-strong)] mb-6">Mini Marketplace</h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="card-base border border-white/10 p-4 shadow-soft">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
            <h2 className="text-lg font-semibold text-[var(--color-text-strong)]">{product.name}</h2>
            <p className="text-white/70 mb-3">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="btn-gradient text-white px-4 py-2 rounded-full hover:opacity-95 transition shadow-soft"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mt-10 p-6 border-t border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-strong)]">🛒 Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-white/60">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b border-white/10 pb-2 text-[var(--color-text)]">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-6">
              <p className="text-lg font-bold text-[var(--color-text)]">
                Total: <span className="text-[var(--color-accent)]">${getTotal()}</span>
              </p>
              <button className="btn-gradient text-white px-5 py-2 rounded-full hover:opacity-95 transition shadow-soft">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>

   
    </section>
  )
};

export default Marketplace;
