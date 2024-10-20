import { useQuery } from '@tanstack/react-query';
import instance from '../../config/axiosInstance';
import { Product } from 'src/types/product';

const StoreOverView = () => {
  const { data: products, isLoading, isError, error } = useQuery({
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error instanceof Error ? error.message : 'Something went wrong'}</div>;
  console.log(products.data);
  return (
    <section className="sec-product bg0 p-t-100 p-b-50">
      <div className="container">
        <div className="p-b-32">
          <h3 className="ltext-105 cl5 txt-center respon1">
            Best seller
          </h3>
        </div>

        <div className="tab01">
          <div className="tab-content p-t-50">
            <div className="tab-pane fade show active" id="best-seller" role="tabpanel">
              <div className="wrap-slick2">
                <div className="slick2">
                  {products.data.map((product: Product) => (
                    <div key={product.id} className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
                      <div className="block2">
                        <div className="block2-pic hov-img0">
                          {product.variants[0]?.images[0] && (
                            <img src={product.variants[0].images[0].name_image} alt={product.name} />
                          )}
                          <a href="#" className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1">
                            Quick View
                          </a>
                        </div>
                        <div className="block2-txt flex-w flex-t p-t-14">
                          <div className="block2-txt-child1 flex-col-l ">
                            <a href="product-detail.html" className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                              {product?.name}
                            </a>
                            <span className="stext-105 cl3">
                              ${product.variants[0]?.price}
                            </span>
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

        <div className="flex-c-m flex-w w-full p-t-45">
          <a href="#" className="flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04">
            View All
          </a>
        </div>
      </div>
    </section>
  );
};

export default StoreOverView;
