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
import Order from "./pages/admin/order/Order";

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
        path: "category/:categoryId",
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
        path: "order",
        element: <Order />,
      },
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
