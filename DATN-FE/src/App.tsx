import { useState } from 'react'
import './App.css'
import Header from './component/Header/Header'
import Slider from './component/Home/Slider'
import Cart from './component/Home/Cart'
import Banner from './component/Home/Banner'
import Product from './component/Home/Product'
import Blog from './component/Home/Blog'
import Footer from './component/Footer/Footer'

function App() {


  return (
    <>
    <Header />
    <Slider />
    <Cart />
    <Slider />
    <Banner />
    <Product />
    <Blog />
    <Footer />
    </>
  )
}

export default App
