import React from 'react';

const Banner = () => {
  return (
    <div className="sec-banner bg0">
      <div className="flex-w flex-c-m">
        {/* Block 1 - Women */}
        <div className="size-202 m-lr-auto respon4">
          <div className="block1 wrap-pic-w">
            <img src="images/banner-04.jpg" alt="IMG-BANNER" />
            <a
              href="product.html"
              className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
            >
              <div className="block1-txt-child1 flex-col-l">
                <span className="block1-name ltext-102 trans-04 p-b-8">
                  Women
                </span>
                <span className="block1-info stext-102 trans-04">Spring 2018</span>
              </div>
              <div className="block1-txt-child2 p-b-4 trans-05">
                <div className="block1-link stext-101 cl0 trans-09">Shop Now</div>
              </div>
            </a>
          </div>
        </div>

        {/* Block 2 - Men */}
        <div className="size-202 m-lr-auto respon4">
          <div className="block1 wrap-pic-w">
            <img src="images/banner-05.jpg" alt="IMG-BANNER" />
            <a
              href="product.html"
              className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
            >
              <div className="block1-txt-child1 flex-col-l">
                <span className="block1-name ltext-102 trans-04 p-b-8">Men</span>
                <span className="block1-info stext-102 trans-04">Spring 2018</span>
              </div>
              <div className="block1-txt-child2 p-b-4 trans-05">
                <div className="block1-link stext-101 cl0 trans-09">Shop Now</div>
              </div>
            </a>
          </div>
        </div>

        {/* Block 3 - Bags */}
        <div className="size-202 m-lr-auto respon4">
          <div className="block1 wrap-pic-w">
            <img src="images/banner-06.jpg" alt="IMG-BANNER" />
            <a
              href="product.html"
              className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
            >
              <div className="block1-txt-child1 flex-col-l">
                <span className="block1-name ltext-102 trans-04 p-b-8">Bags</span>
                <span className="block1-info stext-102 trans-04">New Trend</span>
              </div>
              <div className="block1-txt-child2 p-b-4 trans-05">
                <div className="block1-link stext-101 cl0 trans-09">Shop Now</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
