import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();

  // best sellers
  const bestSellers = products.slice(0, 4);

  return (
    <div className="mt-16 px-4">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
      <div className="flex flex-wrap gap-4 mt-4">
        {bestSellers.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
