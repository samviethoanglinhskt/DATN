import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "../../config/axiosInstance";

import "bootstrap/dist/css/bootstrap.min.css";
import { Product } from "src/types/product";

const ProductList = () => {
  const { id } = useParams<{ id: string }>(); // Lấy ID danh mục từ URL
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

  // Lấy danh sách danh mục
  const { isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await instance.get("http://127.0.0.1:8000/api/category");
      return response.data;
    },
  });

  // Lấy toàn bộ danh sách sản phẩm
  const { data: allProducts, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await instance.get(
        "http://127.0.0.1:8000/api/product-list"
      );
      console.log("All Products API response:", response.data);
      return response.data; // Trả về toàn bộ đối tượng API
    },
  });

  // Lọc sản phẩm theo tb_category_id
  const filteredProducts = Array.isArray(allProducts?.data)
    ? allProducts.data.filter(
        (product: Product) => product.tb_category_id === Number(id)
      )
    : [];

  if (loadingCategories)
    return <div className="text-center my-5">Loading categories...</div>;

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h3 className="text-center mb-5" style={{ marginTop: "80px" }}>
          Danh Mục Sản Phẩm
        </h3>

        {/* Danh sách sản phẩm */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {loadingProducts ? (
            <div className="text-center my-5">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product: Product) => (
              <div
                key={product.id}
                className="col product-item"
                onClick={() => navigate(`/product/${product.id}`)} // Chuyển hướng
                style={{ cursor: "pointer" }} // Đổi con trỏ chuột
              >
                <div className="card h-100 product-card border-0">
                  <div className="position-relative">
                    {product.variants[0]?.images[0] && (
                      <div className="product-image-wrapper">
                        <img
                          src="https://naidecor.vn/wp-content/uploads/2020/07/BST-MP-11.jpg"
                          className="card-img-top product-image"
                          alt={product.name}
                        />
                        <div className="product-overlay">
                          <button className="btn btn-light buy-button">
                            Mua Ngay
                          </button>
                        </div>
                      </div>
                    )}
                    <button className="btn wishlist-btn position-absolute top-0 end-0 m-2">
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title product-name">{product.name}</h5>
                    <p className="product-price fw-bold">
                      ${product.variants[0]?.price}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center my-5">No products found.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
