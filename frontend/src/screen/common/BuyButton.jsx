import React from "react";
import "./BuyButton.css"; 

const BuyButton = ({ onClick }) => {
  return (
    <button className="buy-button mt-2" onClick={onClick}>
      Buy Now
    </button>
  );
};

export default BuyButton;
