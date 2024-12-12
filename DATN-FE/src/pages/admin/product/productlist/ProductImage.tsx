import React from 'react';

const BASE_URL = "http://127.0.0.1:8000";
const STORAGE_URL = `${BASE_URL}/storage`;

export const ProductImage = ({
  src,
  size = 100, // Size should be a number
}: {
  src: string;
  size?: number; // Make sure it's a number
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-lg cursor-pointer`}
      style={{ width: `${size}px`, height: `${size}px` }} // Inline style to dynamically set width and height
      onClick={(e) => {
        e.stopPropagation();
        window.open(`${STORAGE_URL}/${src}`, "_blank");
      }}
    >
      <img
        src={`${STORAGE_URL}/${src}`}
        alt="Product"
        className="w-full h-full object-contain border border-gray-200 hover:opacity-80 transition-all duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-product.png"; // Placeholder image on error
        }}
      />
    </div>
  );
};

export const DetailImage = ({ src }: { src: string }) => {
  return (
    <div
      className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
      style={{
        width: "400px",
        height: "400px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        window.open(`${STORAGE_URL}/${src}`, "_blank");
      }}
    >
      <img
        src={`${STORAGE_URL}/${src}`}
        alt="Product detail"
        className="w-100 h-full hover:opacity-80 transition-all duration-300 cursor-pointer"
        style={{ objectFit: "contain" }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-product.png";
        }}
      />
    </div>
  );
};
