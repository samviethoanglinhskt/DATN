import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "../../config/axiosInstance";
import { Product } from "src/types/product";

const StoreOverView = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await instance.get("/api/product-list");
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );

  return (
    <section className="sec-product bg0 p-t-100 p-b-50">
      <div className="container">
        <h3 className="ltext-105 cl5 txt-center respon1">Best seller</h3>
        <div className="tab01">
          <div className="tab-content p-t-50">
            <div
              className="tab-pane fade show active"
              id="best-seller"
              role="tabpanel"
            >
              <div className="wrap-slick2 d-flex">
                <div className="slick2">
                  {products.data.map((product: Product) => (
                    <div
                      key={product.id}
                      className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15"
                    >
                      <div className="block2">
                        <div className="block2-pic hov-img0">
                          {product.variants[0]?.images[0] && (
                            <img
                              src={product.variants[0].images[0].name_image}
                              alt={product.name}
                            />
                          )}
                          <Link
                            to={`/product/${product.id}`}
                            className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04"
                          >
                            Quick View
                          </Link>
                        </div>
                        <div className="block2-txt flex-w flex-t p-t-14">
                          <div className="block2-txt-child1 flex-col-l ">
                            <Link
                              to={`/product/${product.id}`}
                              className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                            >
                              {product.name}
                            </Link>
                            <span className="stext-105 cl3">
                              ${product.variants[0]?.price}
                            </span>
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
    </section>
  );
};

export default StoreOverView;
