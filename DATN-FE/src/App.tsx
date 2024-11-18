import { useRoutes } from "react-router-dom";
import "./App.css";
import ProductList from "./components/Home/Product";
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import AppCategoryyy from "./pages/admin/category/Category";
import AppProduct from "./pages/admin/product/listProducts";
import Cart from "./pages/client/Cart";
import GuestInfoForm from "./pages/client/GuestInfoForm";
import HomePage from "./pages/client/HomePage";
import Login from "./pages/client/Login";
import OrderDetails from "./pages/client/OrderDetails";
import Payment from "./pages/client/Payment";
import ProductDetail from "./pages/client/ProductDetail";
import Register from "./pages/client/Register";
import CheckoutPage from "./pages/client/Checkout";
import { UserProvider } from "./context/User";
import ProductSteps from "./pages/admin/product/formProduct";
import ProductEdit from "./pages/admin/product/editProduct";
import UserList from "./pages/admin/user/UserList";
import ColorManagement from "./pages/admin/color-size-brand-banner/Color";
import SizeManagement from "./pages/admin/color-size-brand-banner/Size";
import Discount from "./pages/admin/discount/Discount";
import BrandManagement from "./pages/admin/color-size-brand-banner/Brand";
import Order from "./pages/admin/order-size/Order";
import LogoBannerManagement from "./pages/admin/color-size-brand-banner/Banner";


const routeConfig = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "category/:id",
        element: <ProductList />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "guest-info",
        element: <GuestInfoForm />,
      },
      {
        path: "order-details",
        element: <OrderDetails />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "category",
        element: <AppCategoryyy />,
      },
      {
        path: "product",
        element: <AppProduct />,
      },
      {
        path: "product/create",
        element: <ProductSteps />,
      },
      {
        path: "product/edit/:id", 
        element: <ProductEdit />,
      },
      {
        path: "order",
        element: <Order />,
      },
      {
        path: "user",
        element: <UserList />,
      },
      {
        path:"color",
        element:<ColorManagement />
      },
      {
        path:"banner",
        element:<LogoBannerManagement />
      },
      {
        path:"size",
        element:<SizeManagement />
      },
      {
        path:"brand",
        element:<BrandManagement />
      },
      {
        path:"discount",
        element:<Discount />
      }
    ],
  },
];

function App() {
  const routes = useRoutes(routeConfig);

  return (
    <UserProvider>
      <main>{routes}</main>
    </UserProvider>
  );
}

export default App;
