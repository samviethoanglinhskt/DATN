import { Stack } from "@mui/material"
import { Outlet } from "react-router-dom"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import BackToTop from "src/components/Home/BackToTop"
import ButtonZalo from "src/components/Home/ButtonZalo"
import LoadingOverlay from "src/components/Loading/Loading"
import { useLoading } from "src/context/LoadingContext"

const ClientLayout = () => {
    const { loading } = useLoading(); // Lấy trạng thái loading từ LoadingContext

    return (
        <>
            {/* Hiển thị lớp phủ LoadingOverlay khi loading */}
            {loading && <LoadingOverlay />}

            {/* Layout chính */}
            <Stack style={{ display: loading ? "none" : "flex" }}> {/* Ẩn layout khi loading */}
                <Header />
                <Outlet />
                <BackToTop />
                <ButtonZalo
                    pageId="YOUR_ZALO_PAGE_ID"
                    theme="1"
                    width="400"
                    height="600"
                />
                <Footer />
            </Stack>
        </>
    )
}

export default ClientLayout