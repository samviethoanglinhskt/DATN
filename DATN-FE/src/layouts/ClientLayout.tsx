import { Stack } from "@mui/material"
import { Outlet } from "react-router-dom"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import BackToTop from "src/components/Home/BackToTop"

const ClientLayout = () => {

    return (
        <Stack>
            <Header />
            <Outlet />
            <BackToTop />
            <Footer />
        </Stack>
    )
}

export default ClientLayout