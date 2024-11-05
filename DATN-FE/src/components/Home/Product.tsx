import axiosInstance from "src/config/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"; // Import useParams
import { Product } from "src/types/product";

const ProductList = () => {
  const { categoryId } = useParams(); // Get the categoryId from the URL params

  // Fetch products based on the presence of categoryId
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      try {
        // If categoryId exists, fetch products for that category
        // If categoryId is not present, fetch all products
        const url = categoryId
          ? `/api/product-list?category=${categoryId}`
          : `/api/product-list`; // For all products

        const response = await axiosInstance.get(url);
        return response.data;
      } catch (error) {
        throw new Error('Call API thất bại');
      }
    },
    enabled: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error instanceof Error ? error.message : 'Something went wrong'}</div>;

  return (
    <section className="bg0 p-t-23 p-b-140">
      <div className="container" style={{ margin: '100px' }}>
        <div className="p-b-10">
          {/* Dynamically change the heading based on categoryId */}
          <h3 className="ltext-103 cl5">
            {categoryId ? `${categoryId}` : "Tất Cả Sản Phẩm"}
          </h3>
        </div>


        {products?.data.length === 0 ? (
          <div className="no-products-message">
            <h4>không có sản phẩm nảo trong danh mục này.</h4>
          </div>
        ) : (
          <div className="row isotope-grid">
            <div className="tab01">
              <div className="tab-content p-t-50">
                <div className="tab-pane fade show active" id="best-seller" role="tabpanel">
                  <div className="wrap-slick2">
                    <div className="slick2 d-flex">
                      {products?.data.map((product: Product) => (
                        <div key={product.id} className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
                          <div className="block2">
                            <div className="block2-pic hov-img0">
                              {product.variants[0]?.images[0] && (
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8kyFx8Cqh7zQJ4qQj6cdSGALFwYeR34klSg&s"
                                  style={{
                                    width: '100%',
                                    height: '350px',
                                    objectFit: 'cover',
                                  }}
                                  alt={product.name}
                                />
                              )}
                              <a href="#" className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1">
                                Mua Ngay
                              </a>
                            </div>
                            <div className="block2-txt flex-w flex-t p-t-14">
                              <div className="block2-txt-child1 flex-col-l">
                                <a href="product-detail.html" className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                                  {product.name}
                                </a>
                                <span className="stext-105 cl3">${product.variants[0]?.price}</span>
                              </div>
                              <div className="block2-txt-child2 flex-r p-t-3">
                                <a href="#" className="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                                  <img className="icon-heart1 dis-block trans-04" src="src/assets/images/icons/icon-heart-01.png" alt="ICON" />
                                  <img className="icon-heart2 dis-block trans-04 ab-t-l" src="src/assets/images/icons/icon-heart-02.png" alt="ICON" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination (this is static, you'll need to implement pagination logic if needed) */}
        <div className="flex-c-m flex-w w-full p-t-38">
          <a href="#" className="flex-c-m how-pagination1 trans-04 m-all-7 active-pagination1">
            1
          </a>
          <a href="#" className="flex-c-m how-pagination1 trans-04 m-all-7">
            2
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
