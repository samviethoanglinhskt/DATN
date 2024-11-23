import { Box, Typography, Button, Container } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PaymentSuccess = () => {
    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                textAlign: "center",
            }}
        >
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "green", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Đặt hàng thành công
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Cảm ơn bạn đã mua hàng! Giao dịch của bạn đã hoàn tất thành công.
            </Typography>
            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={() => window.location.href = "/myoder"}
                >
                    Xem đơn hàng của tôi
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => window.location.href = "/"}
                >
                    Tiếp tục mua sắm
                </Button>
            </Box>
        </Container>
    );
};

export default PaymentSuccess;
