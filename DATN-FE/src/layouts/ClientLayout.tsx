import { Stack } from "@mui/material"
import { Outlet } from "react-router-dom"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import BackToTop from "src/components/Home/BackToTop"
import ButtonZalo from "src/components/Home/ButtonZalo"

const ClientLayout = () => {

    return (
        <Stack>
            <Header />
            <Outlet />
            <BackToTop />
            {/* Nút Zalo hiển thị trên tất cả các trang */}
            <ButtonZalo
                pageId="YOUR_ZALO_PAGE_ID"
                theme="1"
                width="400"
                height="600"
            />
            <Footer />
        </Stack>
    )
}

export default ClientLayout