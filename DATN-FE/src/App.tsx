import './App.css'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import BackToTop from './components/Home/BackToTop'
import Banner from './components/Home/Banner'
import Blog from './components/Home/Blog'
import Cart from './components/Home/Cart'
import Modall from './components/Home/Modall'
import Product from './components/Home/Product'
import Slider from './components/Home/Slider'
import StoreOverView from './components/Home/StoreOverview'


function App() {


  return (
    <>
      <Header />
      <Cart />
      <Slider />
      <Banner />
      <StoreOverView />
      <Product />
      <Blog />
      <Footer />
      <BackToTop />
      <Modall />
    </>
  )
}

export default App
