import banner1 from "src/assets/images/banner/6.svg"
import banner2 from "src/assets/images/banner/5.svg"

const Slider = () => {
  return (
    <section className="section-slide">
      <div className="wrap-slick1">
        <div className="slick1">
          <div className="item-slick1" style={{ backgroundImage: `url(${banner1})` }}>
            {/* <div className="container h-full">
              <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                <div className="layer-slick1 animated visible-false" data-appear="fadeInDown" data-delay={0}>
                  <span className="ltext-101 cl2 respon2">
                    Chào Mừng Bạn Đã Đến Với Chúng Tôi
                  </span>
                </div>
                <div className="layer-slick1 animated visible-false" data-appear="fadeInUp" data-delay={800}>
                  <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
                    Imperial Beauty
                  </h2>
                </div>
                <div className="layer-slick1 animated visible-false" data-appear="zoomIn" data-delay={1600}>
                  <a href="product.html" className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04">
                    Mua ngay
                  </a>
                </div>
              </div>
            </div> */}
          </div>
          <div className="item-slick1" style={{ backgroundImage: `url(${banner2})` }}>
            {/* <div className="container h-full">
              <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                <div className="layer-slick1 animated visible-false" data-appear="rotateInDownLeft" data-delay={0}>
                  <span className="ltext-101 cl2 respon2">
                    Thương Hiệu Tạo Nên Tên tuổi
                  </span>
                </div>
                <div className="layer-slick1 animated visible-false" data-appear="rotateInUpRight" data-delay={800}>
                  <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
                    New arrivals
                  </h2>
                </div>
                <div className="layer-slick1 animated visible-false" data-appear="rotateIn" data-delay={1600}>
                  <a href="product.html" className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04">
                    Shop Now
                  </a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Slider;
