import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import instance from '../../config/axiosInstance';
import { Product } from 'src/types/product';
import "bootstrap/dist/css/bootstrap.min.css";
import "./NewProduct.css";

const NewProduct = () => {
  const INITIAL_VISIBLE_PRODUCTS = 4;
  const [visibleProducts, setVisibleProducts] = useState(INITIAL_VISIBLE_PRODUCTS);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await instance.get('/api/product-list');
        return response.data;
      } catch (error) {
        throw new Error('Call API thất bại');
      }
    },
  });

  if (isLoading) return <div className="text-center my-5">Loading...</div>;
  if (isError) return (
    <div className="text-center text-danger my-5">
      Error: {error instanceof Error ? error.message : 'Something went wrong'}
    </div>
  );

  const handleToggleProducts = () => {
    if (isExpanded) {
      setVisibleProducts(INITIAL_VISIBLE_PRODUCTS);
      setIsExpanded(false);
    } else {
      setVisibleProducts(products.data.length);
      setIsExpanded(true);
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h3 className="text-center mb-5">Sản Phẩm Mới Nhất</h3>
        
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {products.data.slice(0, visibleProducts).map((product: Product) => (
            <div key={product.id} className="col product-item">
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
                  <h5 className="card-title product-name">
                    {product.name}
                  </h5>
                  <div className="product-description mb-2">
                    Sample text. Click to select the text box.
                  </div>
                  <p className="product-price fw-bold">
                    ${product.variants[0]?.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.data.length > INITIAL_VISIBLE_PRODUCTS && (
          <div className="text-center mt-5">
            <button 
              className={`btn ${isExpanded ? 'btn-outline-danger' : 'btn-outline-dark'} px-4 py-2`}
              onClick={handleToggleProducts}
            >
              {isExpanded ? (
                <>
                  <i className="fas fa-chevron-up me-2"></i>
                  Thu gọn
                </>
              ) : (
                <>
                  <i className="fas fa-chevron-down me-2"></i>
                  Xem thêm
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewProduct;