import * as React from "react";

function SvgShoppingCart(props) {
  return (
    <svg height={24} width={24} xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle
        cx={8}
        cy={21}
        fill="none"
        r={2}
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <circle
        cx={20}
        cy={21}
        fill="none"
        r={2}
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path
        d="M5.67 6H23l-1.68 8.39a2 2 0 01-2 1.61H8.75a2 2 0 01-2-1.74L5.23 2.74A2 2 0 003.25 1H1"
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

export default SvgShoppingCart;
