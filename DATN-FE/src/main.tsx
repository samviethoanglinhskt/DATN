import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { UserProvider } from './context/User.tsx'
import { CartProvider } from './context/Cart.tsx'
import './echo.js'
import { FavoriteProvider } from './context/FavoriteProduct.tsx'
import { LoadingProvider } from './context/LoadingContext.tsx'
axios.defaults.baseURL = "http://127.0.0.1:8000";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <UserProvider>
            <CartProvider>
              <FavoriteProvider>
                <App />
              </FavoriteProvider>
            </CartProvider>
          </UserProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
