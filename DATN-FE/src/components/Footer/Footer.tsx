import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg3 p-t-75 p-b-32">
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-lg-3 p-b-50">
            <h4 className="stext-301 cl0 p-b-30">Sản phẩm</h4>
            <ul>
              <li className="p-b-10">
                <a
                  href="/category/1"
                  className="stext-107 cl7 hov-cl1 trans-04"
                >
                  Son
                </a>
              </li>
              <li className="p-b-10">
                <a
                  href="/category/2"
                  className="stext-107 cl7 hov-cl1 trans-04"
                >
                  Nước tẩy trang
                </a>
              </li>
              <li className="p-b-10">
                <a
                  href="/category/3"
                  className="stext-107 cl7 hov-cl1 trans-04"
                >
                  Serum
                </a>
              </li>
              <li className="p-b-10">
                <a
                  href="/category/5"
                  className="stext-107 cl7 hov-cl1 trans-04"
                >
                  Tonner
                </a>
              </li>
              <li className="p-b-10">
                <a
                  href="/category/17"
                  className="stext-107 cl7 hov-cl1 trans-04"
                >
                  Cusion
                </a>
              </li>
              <li className="p-b-10">
                <a
                  href="/category/18"
                  className="stext-107 cl7 hov-cl1 trans-04"
                >
                  Má hồng
                </a>
              </li>
            </ul>
          </div>

          <div className="col-sm-6 col-lg-3 p-b-50">
            <h4 className="stext-301 cl0 p-b-30">Nội dung</h4>
            <ul>
              <li className="p-b-10">
                <a href="/about" className="stext-107 cl7 hov-cl1 trans-04">
                  Giới thiệu
                </a>
              </li>
              <li className="p-b-10">
                <a href="/blog" className="stext-107 cl7 hov-cl1 trans-04">
                  Bài viết
                </a>
              </li>
              <li className="p-b-10">
                <a href="/contact" className="stext-107 cl7 hov-cl1 trans-04">
                  Liên hệ
                </a>
              </li>
              <li className="p-b-10">
                <a href="/support" className="stext-107 cl7 hov-cl1 trans-04">
                  Chính sách đổi trả
                </a>
              </li>
            </ul>
          </div>

          <div className="col-sm-6 col-lg-3 p-b-50">
            <h4 className="stext-301 cl0 p-b-30">Địa chỉ</h4>
            <p className="stext-107 cl7 size-201">Trịnh Văn Bô - Nam Từ Liêm</p>
            <div className="p-t-27">
              <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                <i className="fa fa-facebook" />
              </a>
              <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                <i className="fa fa-instagram" />
              </a>
              <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                <i className="fa fa-pinterest-p" />
              </a>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3 p-b-50">
            <h4 className="stext-301 cl0 p-b-30">Email</h4>
            <form>
              <div className="wrap-input1 w-full p-b-4">
                <input
                  className="input1 bg-none plh1 stext-107 cl7"
                  type="text"
                  name="email"
                  placeholder="linh@gmail.com"
                />
                <div className="focus-input1 trans-04"></div>
              </div>
              <div className="p-t-18">
                <button className="flex-c-m stext-101 cl0 size-103 bg1 bor1 hov-btn2 p-lr-15 trans-04">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="p-t-40">
          <div className="flex-c-m flex-w p-b-18">
            <a href="#" className="m-all-1">
              <img
                src="src/assets/images/icons/icon-pay-01.png"
                alt="ICON-PAY"
              />
            </a>
            <a href="#" className="m-all-1">
              <img
                src="src/assets/images/icons/icon-pay-02.png"
                alt="ICON-PAY"
              />
            </a>
            <a href="#" className="m-all-1">
              <img
                src="src/assets/images/icons/icon-pay-03.png"
                alt="ICON-PAY"
              />
            </a>
            <a href="#" className="m-all-1">
              <img
                src="src/assets/images/icons/icon-pay-04.png"
                alt="ICON-PAY"
              />
            </a>
            <a href="#" className="m-all-1">
              <img
                src="src/assets/images/icons/icon-pay-05.png"
                alt="ICON-PAY"
              />
            </a>
          </div>

          <p className="stext-107 cl6 txt-center">
            Copyright &copy;
            {new Date().getFullYear()} Imperial Beauty
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
