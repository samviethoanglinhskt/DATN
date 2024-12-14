import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoutes, Navigate } from "react-router-dom";
import "./App.css";
import About from "./components/Home/About";
import Blog from "./components/Home/Blog";
import Contact from "./components/Home/Contact";
import ProductList from "./components/Home/Product";
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import AppCategoryyy from "./pages/admin/category/Category";
import LogoBannerManagement from "./pages/admin/color-size-brand-banner/Banner";
import BrandManagement from "./pages/admin/color-size-brand-banner/Brand";
import ColorManagement from "./pages/admin/color-size-brand-banner/Color";
import SizeManagement from "./pages/admin/color-size-brand-banner/Size";
import Discount from "./pages/admin/discount/Discount";
import OrderMain from "./pages/admin/orderadmin/Order";
import ProductEdit from "./pages/admin/product/editProduct";
import ProductSteps from "./pages/admin/product/formProduct";
import ProductListMain from "./pages/admin/product/productlist/MainProductList";
import UserList from "./pages/admin/user/UserList";
import Cart from "./pages/client/Cart";
import CheckoutPage from "./pages/client/Checkout";
import HomePage from "./pages/client/HomePage";
import Login from "./pages/client/Login";
import FavoritesPage from "./pages/client/MyFavorites/ProductMyLove";
import MyOrders from "./pages/client/MyOrder/MyOder";
import PaymentFailure from "./pages/client/PaymentFailure";
import PaymentSuccess from "./pages/client/PaymentSuccess";
import ProductDetail from "./pages/client/ProductDetail";
import Register from "./pages/client/Register";
import Dashboard from "./pages/admin/dshboard/DashBoard.Main";
import MyInfo from "./pages/client/MyInfo";
import Support from "./components/Home/Support";
import AllProduct from "./components/Home/AllProduct";
import ButtonZalo from "./components/Home/ButtonZalo.js";
import AuthContainer from "./pages/client/LoginNew/AuthContainer.js";
import LayoutAdminNT from "./pages/admin/LayoutAdminNt.js";
import ToggleDashboard from "./pages/admin/dshboard/dashboarddetail/ToggleDashboard.js";
import { useUser } from "./context/User.js";

function App() {
  const { user, setUser } = useUser();
  const navigate = useNavigate(); // Hook dùng để điều hướng

  // Kiểm tra user và tb_role_id trong useEffect
  useEffect(() => {
    if (user?.data?.user?.tb_role_id !== 1 && user?.data?.user?.tb_role_id !== 3) {
      // Nếu tb_role_id không phải là 1 hoặc 3, chuyển hướng về trang chủ
      navigate("/");
    }
  }, [user, navigate]);

  const routeConfig = [
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "blog", element: <Blog /> },
        { path: "support", element: <Support /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "myinfo", element: <MyInfo /> },
        { path: "product/:id", element: <ProductDetail /> },
        { path: "category/:id", element: <ProductList /> },
        { path: "product", element: <AllProduct /> },
        { path: "cart", element: <Cart /> },
        { path: "checkout", element: <CheckoutPage /> },
        { path: "love", element: <FavoritesPage /> },
        { path: "myoder", element: <MyOrders /> },
        { path: "payment-success", element: <PaymentSuccess /> },
        { path: "payment-failure", element: <PaymentFailure /> },
        { path: "loginnew", element: <AuthContainer /> },
      ],
    },
    {
      path: "admin",
      element: user?.data?.user?.tb_role_id === 1 || user?.data?.user?.tb_role_id === 3 ? <AdminLayout /> : <Navigate to="/" />,
      children: [
        { path: "category", element: <AppCategoryyy /> },
        { path: "product/create", element: <ProductSteps /> },
        { path: "product/edit/:id", element: <ProductEdit /> },
        { path: "/admin/product", element: <ProductListMain /> },
        { path: "order", element: <OrderMain /> },
        { path: "user", element: <UserList /> },
        { path: "color", element: <ColorManagement /> },
        { path: "banner", element: <LogoBannerManagement /> },
        { path: "size", element: <SizeManagement /> },
        { path: "brand", element: <BrandManagement /> },
        { path: "discount", element: <Discount /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "detaildashboard", element: <ToggleDashboard /> },
      ],
    },
    {
      path: "adminnt",
      element: user?.data?.user?.tb_role_id === 1 || user?.data?.user?.tb_role_id === 3 ? <LayoutAdminNT /> : <Navigate to="/" />,
      children: [
        { path: "category", element: <AppCategoryyy /> },
        { path: "product/create", element: <ProductSteps /> },
        { path: "product/edit/:id", element: <ProductEdit /> },
        { path: "/adminnt/product", element: <ProductListMain /> },
        { path: "order", element: <OrderMain /> },
        { path: "user", element: <UserList /> },
        { path: "color", element: <ColorManagement /> },
        { path: "banner", element: <LogoBannerManagement /> },
        { path: "size", element: <SizeManagement /> },
        { path: "brand", element: <BrandManagement /> },
        { path: "discount", element: <Discount /> },
      ],
    },
  ];

  const routes = useRoutes(routeConfig);

  return (
    <main>
      {routes}
      <ButtonZalo pageId="YOUR_ZALO_PAGE_ID" theme="1" width="400" height="600" />
    </main>
  );
}

export default App;
