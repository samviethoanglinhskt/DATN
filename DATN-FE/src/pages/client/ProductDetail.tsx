import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HomeOutlined } from "@ant-design/icons";
import axiosInstance from "src/config/axiosInstance";
import { useCart } from "src/context/Cart";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [sizePrice, setSizePrice] = useState<number>(0);

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/product/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    if (!product) {
      alert("Product data is not available.");
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert("Vui lòng chọn kích thước và màu sắc.");
      return;
    }

    if (product) {
      addToCart({
        tb_product_id: product.id,
        quantity: 1,
        tb_size_id: selectedSize,
        tb_color_id: selectedColor,
      });
    } else {
      alert("sản phẩm không tồn tại!");
    }
  };

  const handleBuyNow = () => {
    if (product && selectedSize && selectedColor) {
      navigate("/guest-info", { state: { products: [product] } });
    } else {
      alert("Vui lòng chọn kích thước và màu sắc.");
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #EC4899",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #FCA5A5",
            color: "#DC2626",
            padding: "12px 16px",
            borderRadius: "4px",
            position: "relative",
          }}
        >
          <strong style={{ fontWeight: "bold" }}>Error! </strong>
          <span>
            {error instanceof Error ? error.message : "Something went wrong"}
          </span>
        </div>
      </div>
    );
  }

  // Make sure product and variants are available before trying to access them
  const variant = product?.variants?.[0];
  const sku = variant ? variant.sku : "N/A"; // Safely access SKU

  return (
    <main
      style={{
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* Product Detail Section */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "64px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            gap: "48px",
          }}
        >
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "4px",
                backgroundColor: "#1F2937",
                marginBottom: "32px",
              }}
            ></div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "900",
                color: "#1F2937",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}
            >
              {product.name}
              <span
                style={{
                  display: "block",
                  fontSize: "40px",
                  color: "#EC4899",
                }}
              >
                ${sizePrice}
              </span>
            </h1>
            {/* Display SKU here */}
            <div
              style={{
                fontSize: "18px",
                color: "#4B5563",
                marginBottom: "24px",
              }}
            >
              <strong>SKU:</strong> {sku}
            </div>
            <p
              style={{
                fontSize: "16px",
                color: "#4B5563",
                marginBottom: "32px",
                lineHeight: "1.5",
              }}
            >
              {product.description}
            </p>

            {/* Size Selection */}
            <div>
              <h3>Kích thước:</h3>
              <select
                onChange={(e) => {
                  const selected: any = e.target.value;
                  setSelectedSize(selected);

                  // Chuyển đổi giá trị sang số
                  const selectedSizeId = parseInt(selected, 10);

                  // Tính lại giá kích cỡ khi người dùng chọn size
                  const selectedSizeData = product.sizes.find(
                    (size: any) => size.id === selectedSizeId
                  );
                  setSizePrice(
                    selectedSizeData ? selectedSizeData.pivot.price : 0
                  );
                }}
                value={selectedSize || ""}
                style={{
                  padding: "8px 16px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <option value="">Chọn kích thước</option>
                {product.sizes.map((size: any, index: any) => (
                  <option key={index} value={size.id}>
                    {size.name} - ${size.pivot.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Selection */}
            <div>
              <h3>Màu sắc:</h3>
              <select
                onChange={(e) => {
                  const selected = e.target.value;
                  const selectedColorId = parseInt(selected, 10); // Chuyển đổi sang số
                  // Sử dụng selectedColorId nếu cần
                  setSelectedColor(selectedColorId);
                }}
                value={selectedColor || ""}
                style={{
                  padding: "8px 16px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <option value="">Chọn màu sắc</option>
                {product.colors.map((color: any, index: any) => (
                  <option key={index} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Cart and Buy Now buttons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <button
                onClick={handleAddToCart}
                style={{
                  backgroundColor: "#EC4899",
                  color: "#fff",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  backgroundColor: "transparent",
                  color: "#EC4899",
                  padding: "12px 24px",
                  border: "2px solid #EC4899",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                Mua ngay
              </button>
            </div>
          </div>
          <div
            style={{
              flex: "1",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={product.imageUrl || ""}
              alt={product.name}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
