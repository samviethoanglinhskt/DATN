// constants.ts
export const BASE_URL = "http://127.0.0.1:8000";
export const STORAGE_URL = `${BASE_URL}/storage`;

export const STATUS_OPTIONS = [
  { value: "còn hàng", label: "In Stock" },
  { value: "hết hàng", label: "Out of Stock" }
];

export const IMAGE_CONFIG = {
  maxSize: 5, // MB
  acceptedFormats: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  maxVariantImages: 4
};

// utils.ts
export const formatPrice = (price: number) => {
  return `$${price.toLocaleString()}`;
};

export const validateImage = (file: File) => {
  const isLessThan5MB = file.size / 1024 / 1024 < IMAGE_CONFIG.maxSize;
  if (!isLessThan5MB) {
    throw new Error(`Image must be smaller than ${IMAGE_CONFIG.maxSize}MB`);
  }

  const isValidType = IMAGE_CONFIG.acceptedFormats.includes(file.type);
  if (!isValidType) {
    throw new Error("You can only upload image files");
  }

  return true;
};

export const getFullImageUrl = (path: string) => {
  return `${STORAGE_URL}/${path}`;
};