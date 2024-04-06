import React from "react";
import ProductItem from "./productItem";

const ProductList = () => {
  const products = [
    {
      productId: "1",
      productName: "Pet NFC Tag",
      description: "This is a sample product description. Provide details about the product and its features.",
      price: 8.00,
      currency: "AUD",
      discount: {
        type: "percentage",
        value: 10,
        expirationDate: "2024-12-31",
      },
      freebies: ["Free shipping", "Bonus accessory"],
      category: "Electronics",
      manufacturer: "Example Manufacturer",
      imageUrl: "/assets/petqr.png",
    },
    {
      productId: "2",
      productName: "Collar",
      description: "This is a sample product description. Provide details about the product and its features.",
      price: 8.00,
      currency: "AUD",
      discount: {
        type: "fixed",
        value: 20,
        expirationDate: "2024-12-31",
      },
      freebies: ["Free shipping", "Bonus accessory"],
      category: "Electronics",
      manufacturer: "Example Manufacturer",
      imageUrl: "/assets/petqr.png",
    },
  ];

  return (
    <>
      {products.map(product => <ProductItem key={product.productId} product={product} />)}
    </>
  );
};

export default ProductList;
