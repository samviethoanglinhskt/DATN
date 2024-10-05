import { useState } from 'react'
import './App.css'
import Header from './component/Header/Header'
// import Slider from './component/Home/Slider'
// import Cart from './component/Home/Cart'
// import Banner from './component/Home/Banner'
// import Product from './component/Home/Product'
// import Blog from './component/Home/Blog'
import Footer from './component/Footer/Footer'
import CartProduct from './component/ProducPages/CartProdduct'
import ProductPages from './component/ProducPages/Product'

function App() {


  return (
    <>
      {/* <Header /> */}
      <CartProduct />
      <ProductPages />
      {/* <Footer /> */}
    </>
  )
}

export default App
