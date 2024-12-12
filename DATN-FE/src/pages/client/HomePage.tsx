import Banner from "src/components/Home/Banner"
import NewProduct from "src/components/Home/NewProduct"
import Blog from "src/components/Home/Blog"
import BestSeller from "src/components/Home/BestSeller"
import Slider from "src/components/Home/Slider"

const HomePage = () => {
    return (
        <div>
            <Slider />
            <Banner />
            <NewProduct />
            <Banner />
            <BestSeller />
            <Blog />
        </div>
    )
}

export default HomePage