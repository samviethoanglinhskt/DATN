import { Stack } from "@mui/material"
import { Outlet } from "react-router-dom"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import BackToTop from "src/components/Home/BackToTop"
import Cart from "src/components/Home/Cart"
import Modall from "src/components/Home/Modall"

const ClientLayout = () => {
    return (
        <Stack>
            <Header />
            <Outlet />
            <BackToTop />
            <Modall />
            <Cart />
            <Footer />
        </Stack>
    )
}

export default ClientLayout