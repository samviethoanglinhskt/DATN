import Banner from "src/components/Home/Banner"
import BestSeller from "src/components/Home/BestSeller"
import Blog from "src/components/Home/Blog"
import NewProduct from "src/components/Home/NewProduct"
import Slider from "src/components/Home/Slider"

const HomePage = () => {
    return (
        <div>
            <Slider />
            <Banner />
            <BestSeller />
            <NewProduct />
            <Blog />
        </div>
    )
}

export default HomePage