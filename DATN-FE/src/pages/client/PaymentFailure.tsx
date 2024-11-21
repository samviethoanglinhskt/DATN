import { Box, Typography, Button, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const PaymentFailure = () => {
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
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "red", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Thanh toán thất bại
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Thật không may, hiện tại không thể xử lý thanh toán của bạn. Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ nếu sự cố vẫn tiếp diễn.
            </Typography>
            <Box mt={4}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => window.location.href = "/"}
                >
                    Go to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default PaymentFailure;