import { useRoutes } from 'react-router-dom';
import './App.css'
import ClientLayout from './layouts/ClientLayout';
import HomePage from './pages/client/HomePage';
import Register from './pages/client/Register';
import Login from './pages/client/Login';

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
