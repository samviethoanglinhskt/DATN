import { useRoutes } from "react-router-dom";
import "./App.css";
import ClientLayout from "./layouts/ClientLayout";
import HomePage from "./pages/client/HomePage";
import Register from "./pages/client/Register";
import Login from "./pages/client/Login";
import ProductDetail from "./pages/client/ProductDetail";

import Cart from "./pages/client/Cart";
import { CartProvider } from "./pages/client/Cartshop";
import GuestInfoForm from "./pages/client/GuestInfoForm";
import OrderDetails from "./pages/client/OrderDetails";
import Payment from "./pages/client/Payment";

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
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/guest-info",
        element: <GuestInfoForm />,
      },
      {
        path: "/order-details",
        element: <OrderDetails />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
    ],
  },
];

function App() {
  const routes = useRoutes(routeConfig);

  return (
    <CartProvider>
      <main>{routes}</main>
    </CartProvider>
  );
}

export default App;
