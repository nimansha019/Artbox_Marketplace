import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, currency } = useAppContext();
  const navigate = useNavigate();

  const handleAddToCart = (e) => { e.stopPropagation(); addToCart(product._id); };
  const handleIncrease = (e) => { e.stopPropagation(); addToCart(product._id); };
  const handleDecrease = (e) => { e.stopPropagation(); removeFromCart(product._id); };

  const goToProduct = () => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    window.scrollTo(0, 0);
  };

  const quantity = cartItems[product._id] || 0;

  return product && (
    <div
      onClick={goToProduct}
      className="border p-4 rounded-lg flex flex-col items-center cursor-pointer"
    >
      <img
        src={product.image[0]}
        alt={product.name}
        className="w-40 h-40 object-cover"
      />
      <p className="mt-2 text-lg font-medium">{product.name}</p>
      <p className="text-gray-600">
        LKR {parseInt(product.price, 10)}
      </p>

      <div className="flex items-center mt-2 gap-2">
        {quantity > 0 ? (
          <>
            <button
              onClick={handleDecrease}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={handleIncrease}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </>
        ) : (
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
