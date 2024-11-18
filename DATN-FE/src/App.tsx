import { useRoutes } from "react-router-dom";
import "./App.css";
import ProductList from "./components/Home/Product";
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import AppCategoryyy from "./pages/admin/category/Category";
import AppProduct from "./pages/admin/product/listProducts";
import Cart from "./pages/client/Cart";
import HomePage from "./pages/client/HomePage";
import Login from "./pages/client/Login";
import ProductDetail from "./pages/client/ProductDetail";
import Register from "./pages/client/Register";
import CheckoutPage from "./pages/client/Checkout";
import { UserProvider } from "./context/User";
import Order from "./pages/admin/order/Order";
import ProductSteps from "./pages/admin/product/formProduct";
import ProductEdit from "./pages/admin/product/editProduct";
import Blog from "./components/Home/Blog";
import Contact from "./components/Home/Contact";

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
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/contact",
        element: <Contact />,
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
