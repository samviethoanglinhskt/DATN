import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "../../config/axiosInstance";
import { useCart } from "./Cartshop";
import { Button, Typography, Image, Alert, Spin } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await instance.get(`/api/product/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Spin size="large" />;
  if (isError)
    return (
      <Alert
        message="Error"
        description={
          error instanceof Error ? error.message : "Something went wrong"
        }
        type="error"
        showIcon
      />
    );

  const handleAddToCart = async () => {
    if (product) {
      // Add product to local cart
      addToCart({
        id: product.id,
        name: product.name,
        price: product.variants[0]?.price || 0,
        quantity: 1,
      });

      try {
        const token = localStorage.getItem("jwt_token");
        const response = await instance.post(
          "api/add-cart",
          {
            tb_product_id: product.id,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("Sản phẩm đã được thêm vào giỏ hàng!");
        } else {
          alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } else {
      alert("Sản phẩm không tồn tại.");
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigate("/guest-info", { state: { products: [product] } });
    }
  };

  return (
    <div
      className="product-detail"
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <Title level={2}>{product.name}</Title>
        <Image
          src={product.variants[0]?.images[0].name_image}
          alt={product.name}
          width={300}
          preview={false}
        />
        <Paragraph strong>Price: ${product.variants[0]?.price}</Paragraph>
        <Paragraph>{product.description}</Paragraph>
        <Button
          type="primary"
          onClick={handleAddToCart}
          style={{ marginBottom: "10px" }}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button
          type="primary"
          onClick={handleBuyNow}
          style={{ marginBottom: "10px", marginLeft: "10px" }}
        >
          Mua ngay
        </Button>
        <Button type="link" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
