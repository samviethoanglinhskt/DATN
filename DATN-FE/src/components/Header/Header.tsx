import { Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "src/config/axiosInstance";
import { useUser } from "src/context/User";
import { Category } from "src/types/product";
import logo from "src/assets/images/icons/logo-01.png";
import { useCart } from "src/context/Cart";
import {
  ArrowCircleDownOutlined,
  CarCrashOutlined,
  LogoutOutlined,
} from "@mui/icons-material";

const Header: React.FC = () => {
  const { user, setUser } = useUser();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();
  // Hàm thêm sản phẩm vào yêu thích
  const { data: favoriteCount } = useQuery({
    queryKey: ["favoriteCount"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/favorites/count", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data.count; // Giả sử API trả về { count: số_lượng_yêu_thích }
      } catch (error) {
        console.error("Error fetching favorite count:", error);
        return 0;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // Cập nhật dữ liệu sau mỗi 30s
  });
  // State to manage the open status of the menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFixed, setIsFixed] = useState(false); // Trạng thái cố định menu
  const [topOffset, setTopOffset] = useState(0); // Độ cao của top-bar

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categorys"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/category");
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error("Call API thất bại");
      }
    },
  });

  const handleCartClick = () => {
    if (!user) {
      alert("Bạn phải đăng nhập để vào giỏ hàng");
      // navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  // Xử lý logic cố định menu khi cuộn
  useEffect(() => {
    const topBar = document.querySelector(".top-bar") as HTMLElement | null;
    const posWrapHeader = topBar ? topBar.offsetHeight : 0;
    setTopOffset(posWrapHeader);

    const handleScroll = () => {
      if (window.scrollY > posWrapHeader) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );

  return (
    <header>
      {/* Header desktop */}
      <div
        className={`container-menu-desktop ${isFixed ? "fix-menu-desktop" : ""}`}
        style={{
          top: isFixed ? 0 : `${topOffset - window.scrollY}px`,
        }}
      >
        {/* Topbar */}
        <div className="top-bar">
          <div className="content-topbar flex-sb-m h-full container">
            <div className="left-top-bar">
              Chào Mừng Bạn Đã Đến Với Trang Web Của Chúng Tôi
            </div>
            {user ? (
              <div className="right-top-bar flex-w h-full">
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography color="white">Hi, {user.data.name}</Typography>
                  </Grid>
                  <Grid item>
                    {/* Add hover effect to trigger the menu */}
                    <IconButton
                      sx={{
                        color: "white",
                      }}
                      onMouseEnter={handleMenuOpen}
                    >
                      <AccountCircleIcon />
                    </IconButton>
                    {/* Menu for logout and password reset */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      MenuListProps={{
                        onMouseLeave: handleMenuClose,
                      }}
                      sx={{
                        "& .MuiPaper-root": {
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          padding: "8px",
                          minWidth: "200px",
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() => navigate("/admin")}
                        sx={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          gap: "12px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(120deg, #fff5f7 0%, #fff 100%)",
                            color: "#717FE0",
                            "& .menu-icon": {
                              transform: "scale(1.1)",
                              color: "#717FE0",
                            },
                          },
                        }}
                      >
                        <ArrowCircleDownOutlined
                          style={{
                            fontSize: "18px",
                            transition: "all 0.3s ease",
                          }}
                        />
                        Admin
                      </MenuItem>
                      <MenuItem
                        onClick={() => navigate("/myoder")}
                        sx={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          gap: "12px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(120deg, #fff5f7 0%, #fff 100%)",
                            color: "#717FE0",
                            "& .menu-icon": {
                              transform: "scale(1.1)",
                              color: "#717FE0",
                            },
                          },
                        }}
                      >
                        <CarCrashOutlined
                          style={{
                            fontSize: "18px",
                            transition: "all 0.3s ease",
                          }}
                        />
                        Đơn hàng của tôi
                      </MenuItem>
                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          gap: "12px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(120deg, #fff5f7 0%, #fff 100%)",
                            color: "#717FE0",
                            "& .menu-icon": {
                              transform: "scale(1.1)",
                              color: "#717FE0",
                            },
                          },
                        }}
                      >
                        <LogoutOutlined
                          style={{
                            fontSize: "18px",
                            transition: "all 0.3s ease",
                          }}
                        />
                        Đăng xuất
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </div>
            ) : (
              <div className="right-top-bar flex-w h-full">
                <a href="/login" className="flex-c-m trans-04 p-lr-25">
                  Đăng nhập
                </a>
                <a href="/register" className="flex-c-m trans-04 p-lr-25">
                  Đăng ký
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="wrap-menu-desktop">
          <nav className="limiter-menu-desktop container">
            {/* Logo desktop */}
            <a href="/" className="logo">
              <img src={logo} alt="IMG-LOGO" />
            </a>

            {/* Menu desktop */}
            <div className="menu-desktop">
              <ul className="main-menu">
                <li className="active-menu">
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="#">Sản phẩm</a>
                  <ul className="sub-menu">
                    {data.map((category: Category) => (
                      <li key={category.id}>
                        <Link to={`/category/${category.id}`}>
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li>
                  <a href="shoping-cart.html">Thương hiệu</a>
                </li>
                <li>
                  <Link to="/about">Giới thiệu</Link>
                </li>
                <li>
                  <Link to="/blog">Bài viết</Link>
                </li>
                <li>
                  <Link to="/contact">Liên hệ</Link>
                </li>
              </ul>
            </div>

            {/* Icon header */}
            <div className="wrap-icon-header flex-w flex-r-m">
              <div className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 js-show-modal-search">
                <i className="zmdi zmdi-search"></i>
              </div>
              <a
                href="#"
                onClick={handleCartClick}
                className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart"
                data-notify={totalQuantity}
              >
                <i className="zmdi zmdi-shopping-cart"></i>
              </a>
              <a
                href="/love"
                className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti"
                data-notify={isLoading ? 0 : favoriteCount} // Cập nhật số lượng yêu thích
              >
                <i className="zmdi zmdi-favorite-outline"></i>
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* header mobie */}
      <div className="wrap-header-mobile">
        <div className="logo-mobile">
          <a href="/">
            <img src="src/assets/images/icons/logo-01.png" alt="IMG-LOGO" />
          </a>
        </div>
        <div className="wrap-icon-header flex-w flex-r-m m-r-15">
          <div className="icon-header-item cl2 hov-cl1 trans-04 p-r-11 js-show-modal-search">
            <i className="zmdi zmdi-search"></i>
          </div>
          <div
            className="icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti js-show-cart"
            data-notify={totalQuantity}
          >
            <i className="zmdi zmdi-shopping-cart"></i>
          </div>
          <a
            href="#"
            className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti"
            data-notify="0"
          >
            <i className="zmdi zmdi-favorite-outline"></i>
          </a>
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
        <ul className="topbar-mobile">
          <li>
            <div className="left-top-bar">
              Free shipping for standard order over $100
            </div>
          </li>
          <li>
            <div className="right-top-bar flex-w h-full">
              <a href="#" className="flex-c-m p-lr-10 trans-04">
                Help & FAQs
              </a>
              <a href="#" className="flex-c-m p-lr-10 trans-04">
                My Account
              </a>
              <a href="#" className="flex-c-m p-lr-10 trans-04">
                EN
              </a>
              <a href="#" className="flex-c-m p-lr-10 trans-04">
                USD
              </a>
            </div>
          </li>
        </ul>

        <ul className="main-menu-m">
          <li>
            <a href="index.html">Home</a>
            <ul className="sub-menu-m">
              <li>
                <a href="index.html">Homepage 1</a>
              </li>
              <li>
                <a href="home-02.html">Homepage 2</a>
              </li>
              <li>
                <a href="home-03.html">Homepage 3</a>
              </li>
            </ul>
            <span className="arrow-main-menu-m">
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </span>
          </li>
          <li>
            <a href="product.html">Shop</a>
          </li>
          <li>
            <a
              href="shoping-cart.html"
              className="label1 rs1"
              data-label1="hot"
            >
              Features
            </a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
          <li>
            <a href="about.html">About</a>
          </li>
          <li>
            <a href="contact.html">Contact</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
