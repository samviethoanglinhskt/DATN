import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header-v2">
      {/* Header desktop */}
      <div className="container-menu-desktop trans-03">
        <div className="wrap-menu-desktop">
          <nav className="limiter-menu-desktop p-l-45">
            {/* Logo desktop */}
            <a href="#" className="logo">
              <img src="images/icons/logo-01.png" alt="IMG-LOGO" />
            </a>

            {/* Menu desktop */}
            <div className="menu-desktop">
              <ul className="main-menu">
                <li className="active-menu">
                  <a href="index.html">Home</a>
                  <ul className="sub-menu">
                    <li><a href="index.html">Homepage 1</a></li>
                    <li><a href="home-02.html">Homepage 2</a></li>
                    <li><a href="home-03.html">Homepage 3</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#">Shop</a>
                </li>
                <li className="label1" data-label1="hot">
                  <a href="shoping-cart.html">Features</a>
                </li>
                <li>
                  <a href="blog.html">Blog</a>
                </li>
                <li>
                  <a href="about.html">About</a>
                </li>
                <li>
                  <a href="contact.html">Contact</a>
                </li>
              </ul>
            </div>

            {/* Icon header */}
            <div className="wrap-icon-header flex-w flex-r-m h-full">
              <div className="flex-c-m h-full p-r-24">
                <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 js-show-modal-search">
                  <i className="zmdi zmdi-search"></i>
                </div>
              </div>

              <div className="flex-c-m h-full p-l-18 p-r-25 bor5">
                <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart" data-notify="2">
                  <i className="zmdi zmdi-shopping-cart"></i>
                </div>
              </div>

              <div className="flex-c-m h-full p-lr-19">
                <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 js-show-sidebar">
                  <i className="zmdi zmdi-menu"></i>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Header Mobile */}
      <div className="wrap-header-mobile">
        {/* Logo mobile */}
        <div className="logo-mobile">
          <a href="index.html">
            <img src="images/icons/logo-01.png" alt="IMG-LOGO" />
          </a>
        </div>

        {/* Icon header */}
        <div className="wrap-icon-header flex-w flex-r-m h-full m-r-15">
          <div className="flex-c-m h-full p-r-10">
            <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 js-show-modal-search">
              <i className="zmdi zmdi-search"></i>
            </div>
          </div>

          <div className="flex-c-m h-full p-lr-10 bor5">
            <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart" data-notify="2">
              <i className="zmdi zmdi-shopping-cart"></i>
            </div>
          </div>
        </div>

        {/* Button show menu */}
        <div className="btn-show-menu-mobile hamburger hamburger--squeeze">
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className="menu-mobile">
        <ul className="main-menu-m">
          <li>
            <a href="index.html">Home</a>
            <ul className="sub-menu-m">
              <li><a href="index.html">Homepage 1</a></li>
              <li><a href="home-02.html">Homepage 2</a></li>
              <li><a href="home-03.html">Homepage 3</a></li>
            </ul>
            <span className="arrow-main-menu-m">
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </span>
          </li>
          <li>
            <a href="product.html">Shop</a>
          </li>
          <li>
            <a href="shoping-cart.html" className="label1 rs1" data-label1="hot">Features</a>
          </li>
          <li>
            <a href="blog.html">Blog</a>
          </li>
          <li>
            <a href="about.html">About</a>
          </li>
          <li>
            <a href="contact.html">Contact</a>
          </li>
        </ul>
      </div>

      {/* Modal Search */}
      <div className="modal-search-header flex-c-m trans-04 js-hide-modal-search">
        <div className="container-search-header">
          <button className="flex-c-m btn-hide-modal-search trans-04 js-hide-modal-search">
            <img src="images/icons/icon-close2.png" alt="CLOSE" />
          </button>

          <form className="wrap-search-header flex-w p-l-15">
            <button className="flex-c-m trans-04">
              <i className="zmdi zmdi-search"></i>
            </button>
            <input className="plh3" type="text" name="search" placeholder="Search..." />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
