import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "../../config/axiosInstance";
import { useCart } from "./Cartshop";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
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

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.variants[0]?.price || 0,
        quantity: 1,
      });
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    }
  };
  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <img src={product.variants[0]?.images[0].name_image} alt={product.name} />
      <p>Price: ${product.variants[0]?.price}</p>
      <p>{product.description}</p>
      <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
      <Link to="/">Home</Link>
    </div>
  );
};

export default ProductDetail;
