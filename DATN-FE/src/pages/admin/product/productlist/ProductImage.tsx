import React from 'react';

const BASE_URL = "http://127.0.0.1:8000";
const STORAGE_URL = `${BASE_URL}/storage`;

export const ProductImage = ({
  src,
  size = "100",
}: {
  src: string;
  size?: string;
}) => {
  return (
    <div
      className={`relative w-[${size}px] h-[${size}px] overflow-hidden rounded-lg cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        window.open(`${STORAGE_URL}/${src}`, "_blank");
      }}
    >
      <img
        src={`${STORAGE_URL}/${src}`}
        alt="Product"
        className="w-full h-full object-contain border border-gray-200 hover:opacity-80 transition-all duration-300"
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
        className="w-full h-full hover:opacity-80 transition-all duration-300 cursor-pointer"
        style={{ objectFit: "contain" }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-product.png";
        }}
      />
    </div>
  );
};