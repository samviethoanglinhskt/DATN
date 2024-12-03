import { Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "src/config/axiosInstance";
import { useUser } from "src/context/User";
import { Category } from "src/types/product";
import logo from "src/assets/images/logo/logo.svg";
import { useCart } from "src/context/Cart";
import { LogoutOutlined } from "@mui/icons-material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
// Cache constants
const CACHE_KEYS = {
  CATEGORIES: "cached_categories",
  FAVORITE_COUNT: "cached_favorite_count",
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Cache utility functions
const getCache = (key: string) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const setCache = (key: string, data: any) => {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};

const Header: React.FC = () => {
  const [name, setName] = useState("");
  const { user, setUser } = useUser();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [topOffset, setTopOffset] = useState(0);

  useEffect(() => {
    if (user?.data?.user) {
      setName(user.data.user.name);
    }
  }, [user]); // Chỉ chạy khi `user` thay đổi

  // Enhanced categories query with caching
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categorys"],
    queryFn: async () => {
      const cachedCategories = getCache(CACHE_KEYS.CATEGORIES);
      if (cachedCategories) {
        return cachedCategories;
      }

      try {
        const response = await axiosInstance.get("/api/category");
        setCache(CACHE_KEYS.CATEGORIES, response.data);
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error("Call API thất bại");
      }
    },
    staleTime: CACHE_DURATION,
    cacheTime: CACHE_DURATION,
    retry: 1,
  });

  // Cleanup caches
  useEffect(() => {
    return () => {
      Object.values(CACHE_KEYS).forEach((key) => {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const { timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > CACHE_DURATION) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    };
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Enhanced logout with cache clearing
  const handleLogout = () => {
    Object.values(CACHE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem("token");
    setUser(null);
    queryClient.clear();
    navigate("/login");
    window.location.reload();
  };

  const handleCartClick = () => {
    if (!user) {
      alert("Bạn phải đăng nhập để vào giỏ hàng");
    } else {
      navigate("/cart");
    }
  };

  useEffect(() => {
    const topBar = document.querySelector(".top-bar") as HTMLElement | null;
    const posWrapHeader = topBar ? topBar.offsetHeight : 0;
    setTopOffset(posWrapHeader);

    const handleScroll = () => {
      setIsFixed(window.scrollY > posWrapHeader);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        className={`container-menu-desktop ${
          isFixed ? "fix-menu-desktop" : ""
        }`}
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
                    <Typography color="white">Hi, {name}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      sx={{
                        color: "white",
                      }}
                      onMouseEnter={handleMenuOpen}
                    >
                      <AccountCircleIcon />
                    </IconButton>
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
                      {(user.data.user.tb_role_id == 1 ||
                        user.data.user.tb_role_id == 3) && (
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
                          <AdminPanelSettingsIcon
                            style={{
                              fontSize: "18px",
                              transition: "all 0.3s ease",
                            }}
                          />
                          Admin
                        </MenuItem>
                      )}

                      <MenuItem
                        onClick={() => navigate("/myinfo")}
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
                        <VerifiedUserIcon
                          style={{
                            fontSize: "18px",
                            transition: "all 0.3s ease",
                          }}
                        />
                        Tài khoản của tôi
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
                        <ListAltIcon
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
              <img
                src={logo}
                alt="IMG-LOGO"
                style={{ transform: "scale(2.5)", transformOrigin: "center" }}
              />
            </a>

            {/* Menu desktop */}
            <div className="menu-desktop">
              <ul className="main-menu">
                <li className="active-menu">
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/product">Sản phẩm</a>
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
                  <Link to="/about">Giới thiệu</Link>
                </li>
                <li>
                  <Link to="/blog">Bài viết</Link>
                </li>
                <li>
                  <Link to="/contact">Liên hệ</Link>
                </li>
                <li>
                  <Link to="/support">Chính sách đổi trả</Link>
                </li>
              </ul>
            </div>

            {/* Icon header */}
            <div className="wrap-icon-header flex-w flex-r-m">
              <div className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 js-show-modal-search">
                <i className="zmdi zmdi-search"></i>
              </div>
              <a
                href=""
                onClick={handleCartClick}
                className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti "
                data-notify={totalQuantity}
              >
                <i className="zmdi zmdi-shopping-cart"></i>
              </a>
              <a
                href="/love"
                className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti"
                data-notify="0"
              >
                <i className="zmdi zmdi-favorite-outline"></i>
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Header Mobile */}
      <div className="wrap-header-mobile">
        {/* Logo moblie */}
        <div className="logo-mobile">
          <a href="/">
            <img
              src={logo}
              alt="IMG-LOGO"
              style={{ transform: "scale(2.5)", transformOrigin: "center" }}
            />
          </a>
        </div>

        {/* Icon header */}
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
              // Tiếp tục từ phần Menu Mobile
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
            <a href="/">Trang chủ</a>
          </li>
          <li>
            <a href="#">Sản phẩm</a>
            <ul className="sub-menu-m">
              {data.map((category: Category) => (
                <li key={category.id}>
                  <Link to={`/category/${category.id}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
            <span className="arrow-main-menu-m">
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </span>
          </li>
          <li>
            <a href="#">Thương hiệu</a>
          </li>
          <li>
            <Link to="/blog">Bài viết</Link>
          </li>
          <li>
            <Link to="/about">Giới thiệu</Link>
          </li>
          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>
          <li>
            <Link to="/support">Chính sách đổi trả</Link>
          </li>
        </ul>
      </div>

      {/* Modal Search */}
      <div className="modal-search-header flex-c-m trans-04 js-hide-modal-search">
        <div className="container-search-header">
          <button className="flex-c-m btn-hide-modal-search trans-04 js-hide-modal-search">
            <img src="src/assets/images/icons/icon-close2.png" alt="CLOSE" />
          </button>

          <form className="wrap-search-header flex-w p-l-15">
            <button className="flex-c-m trans-04">
              <i className="zmdi zmdi-search"></i>
            </button>
            <input
              className="plh3"
              type="text"
              name="search"
              placeholder="Tìm kiếm..."
            />
          </form>
        </div>
      </div>
    </header>
  );
};

// Override React Query's default stale time for this component
export const headerQueryConfig = {
  queries: {
    staleTime: CACHE_DURATION,
  },
};

export default Header;
