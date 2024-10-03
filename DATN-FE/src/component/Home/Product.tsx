import React from 'react';

const Product = () => {
  return (
    <section className="sec-product bg0 p-t-100 p-b-50">
      <div className="container">
        <div className="p-b-32">
          <h3 className="ltext-105 cl5 txt-center respon1">Store Overview</h3>
        </div>

        {/* Tab01 */}
        <div className="tab01">
          {/* Nav tabs */}
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item p-b-10">
              <a className="nav-link active" data-toggle="tab" href="#best-seller" role="tab">
                Best Seller
              </a>
            </li>

            <li className="nav-item p-b-10">
              <a className="nav-link" data-toggle="tab" href="#featured" role="tab">
                Featured
              </a>
            </li>

            <li className="nav-item p-b-10">
              <a className="nav-link" data-toggle="tab" href="#sale" role="tab">
                Sale
              </a>
            </li>

            <li className="nav-item p-b-10">
              <a className="nav-link" data-toggle="tab" href="#top-rate" role="tab">
                Top Rate
              </a>
            </li>
          </ul>

          {/* Tab panes */}
          <div className="tab-content p-t-50">
            {/* Best Seller */}
            <div className="tab-pane fade show active" id="best-seller" role="tabpanel">
              {/* Slide2 */}
              <div className="wrap-slick2">
                <div className="slick2">
                  <div className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
                    {/* Block2 */}
                    <div className="block2">
                      <div className="block2-pic hov-img0">
                        <img src="images/product-01.jpg" alt="IMG-PRODUCT" />
                        <a
                          href="#"
                          className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                        >
                          Quick View
                        </a>
                      </div>

                      <div className="block2-txt flex-w flex-t p-t-14">
                        <div className="block2-txt-child1 flex-col-l ">
                          <a
                            href="product-detail.html"
                            className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                          >
                            Esprit Ruffle Shirt
                          </a>
                          <span className="stext-105 cl3">$16.64</span>
                        </div>

                        <div className="block2-txt-child2 flex-r p-t-3">
                          <a href="#" className="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                            <img
                              className="icon-heart1 dis-block trans-04"
                              src="images/icons/icon-heart-01.png"
                              alt="ICON"
                            />
                            <img
                              className="icon-heart2 dis-block trans-04 ab-t-l"
                              src="images/icons/icon-heart-02.png"
                              alt="ICON"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured */}
            <div className="tab-pane fade" id="featured" role="tabpanel">
              <div className="wrap-slick2">
                <div className="slick2">
                  <div className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
                    <div className="block2">
                      <div className="block2-pic hov-img0">
                        <img src="images/product-09.jpg" alt="IMG-PRODUCT" />
                        <a
                          href="#"
                          className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                        >
                          Quick View
                        </a>
                      </div>

                      <div className="block2-txt flex-w flex-t p-t-14">
                        <div className="block2-txt-child1 flex-col-l ">
                          <a
                            href="product-detail.html"
                            className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                          >
                            Converse All Star Hi Plimsolls
                          </a>
                          <span className="stext-105 cl3">$75.00</span>
                        </div>

                        <div className="block2-txt-child2 flex-r p-t-3">
                          <a href="#" className="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                            <img
                              className="icon-heart1 dis-block trans-04"
                              src="images/icons/icon-heart-01.png"
                              alt="ICON"
                            />
                            <img
                              className="icon-heart2 dis-block trans-04 ab-t-l"
                              src="images/icons/icon-heart-02.png"
                              alt="ICON"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sale */}
            <div className="tab-pane fade" id="sale" role="tabpanel">
              <div className="wrap-slick2">
                <div className="slick2">
                  <div className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
                    <div className="block2">
                      <div className="block2-pic hov-img0">
                        <img src="images/product-02.jpg" alt="IMG-PRODUCT" />
                        <a
                          href="#"
                          className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                        >
                          Quick View
                        </a>
                      </div>

                      <div className="block2-txt flex-w flex-t p-t-14">
                        <div className="block2-txt-child1 flex-col-l ">
                          <a
                            href="product-detail.html"
                            className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                          >
                            Herschel supply
                          </a>
                          <span className="stext-105 cl3">$35.31</span>
                        </div>

                        <div className="block2-txt-child2 flex-r p-t-3">
                          <a href="#" className="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                            <img
                              className="icon-heart1 dis-block trans-04"
                              src="images/icons/icon-heart-01.png"
                              alt="ICON"
                            />
                            <img
                              className="icon-heart2 dis-block trans-04 ab-t-l"
                              src="images/icons/icon-heart-02.png"
                              alt="ICON"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Rate */}
            <div className="tab-pane fade" id="top-rate" role="tabpanel">
              <div className="wrap-slick2">
                <div className="slick2">
                  <div className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
                    <div className="block2">
                      <div className="block2-pic hov-img0">
                        <img src="images/product-03.jpg" alt="IMG-PRODUCT" />
                        <a
                          href="#"
                          className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                        >
                          Quick View
                        </a>
                      </div>

                      <div className="block2-txt flex-w flex-t p-t-14">
                        <div className="block2-txt-child1 flex-col-l ">
                          <a
                            href="product-detail.html"
                            className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                          >
                            Only Check Trouser
                          </a>
                          <span className="stext-105 cl3">$25.50</span>
                        </div>

                        <div className="block2-txt-child2 flex-r p-t-3">
                          <a href="#" className="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                            <img
                              className="icon-heart1 dis-block trans-04"
                              src="images/icons/icon-heart-01.png"
                              alt="ICON"
                            />
                            <img
                              className="icon-heart2 dis-block trans-04 ab-t-l"
                              src="images/icons/icon-heart-02.png"
                              alt="ICON"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
