import { useRoutes } from 'react-router-dom';
import './App.css'
import ClientLayout from './layouts/ClientLayout';
import HomePage from './pages/client/HomePage';
import Register from './pages/client/Register';
import Login from './pages/client/Login';
import ProductList from './components/Home/Product';

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
        path: "product",
        element: <ProductList />,
      },
      { path: "/product/:categoryId" ,
        element: <ProductList />} 
    ],
  }
];

function App() {
  const routes = useRoutes(routeConfig);

  return (
    <main>{routes}</main>

  );
}

export default App
