import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Product } from "src/types/product";
import axiosInstance from "../../config/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import "src/components/css/BestSeller.css";

// Hàm lưu dữ liệu vào localStorage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`${key}_updated_at`, Date.now().toString());
};

// Hàm lấy dữ liệu từ localStorage
const getFromLocalStorage = (key: string, maxAge: number) => {
  const cachedData = localStorage.getItem(key);
  const updatedAt = localStorage.getItem(`${key}_updated_at`);

  if (cachedData && updatedAt) {
    const age = Date.now() - parseInt(updatedAt, 10);
    if (age < maxAge) {
      return JSON.parse(cachedData);
    }
  }
  return null;
};

const NewProduct = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products-new"],
    queryFn: async () => {
      // Kiểm tra dữ liệu cache trước
      const cachedProducts = getFromLocalStorage("products-new", 1000 * 60 * 60); // 1 giờ
      if (cachedProducts) {
        return cachedProducts;
      }

      // Gọi API nếu không có cache
      try {
        const response = await axiosInstance.get("/api/product-new");
        const data = response.data;

        // Lưu dữ liệu vào localStorage
        saveToLocalStorage("products-new", data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  if (isLoading) return <div className="text-center my-5">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-danger my-5">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );

  return (
    <section className="product-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title" style={{ textDecoration: "none" }}>
            Top 10 Sản Phẩm Mới Nhất
          </h2>
          <div className="title-underline"></div>
        </div>

        <div className="slider">
          <div className="slide-track">
            {products.data.map((product: Product) => (
              <div key={product.id} className="slide">
                <div className="product-inner">
                  <div className="product-image-wrapper">
                    <img
                      src={`http://127.0.0.1:8000/storage/${product.image}`}
                      className="product-image"
                      alt={product.name}
                    />
                  </div>
                  <div className="product-info">
                    <Link to={`/product/${product.id}`} className="product-link">
                      <h5 className="product-title">{product.name}</h5>
                    </Link>
                    <p className="product-price">
                      {product.variants[0]?.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewProduct;
