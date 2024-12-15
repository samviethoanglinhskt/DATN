import { Box, Grid, Link, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "src/types/user";
import axiosInstance from "src/config/axiosInstance";
import { message } from "antd";
import "src/pages/client/css/Login.css";
import { MailOutlined, KeyOutlined, LoadingOutlined } from "@ant-design/icons";

const ForgotPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<User>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<User> = async (data) => {
        try {
            const hide = message.loading("Đang xử lý...", 0);
            const response = await axiosInstance.post("/api/forgot_password", data);
            hide();

            if (response.data.success) {
                message.success({
                    content: "Đã gửi hướng dẫn lấy lại mật khẩu đến email của bạn!",
                    icon: (
                        <i className="fas fa-check-circle" style={{ color: "#52c41a" }} />
                    ),
                    duration: 2,
                });
                navigate("/login");
            } else {
                message.error({
                    content: response.data.message || "Lỗi khi gửi yêu cầu",
                    duration: 3,
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            message.error({
                content: error.response?.data?.message || "Lỗi kết nối server",
                duration: 3,
            });
            console.error("Forgot password error:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-overlay">
                <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg"></div>

                <Box className="login-form-container">
                    <Box className="login-form-box">
                        <Typography component="h1" variant="h3" className="login-title">
                            Quên mật khẩu
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            className="login-form"
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        autoComplete="email"
                                        {...register("email", {
                                            required: "Email là bắt buộc",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Email không hợp lệ",
                                            },
                                        })}
                                        error={!!errors?.email}
                                        helperText={errors?.email?.message}
                                        InputProps={{
                                            startAdornment: <MailOutlined className="input-icon" />,
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <LoadingOutlined className="mr-2" />
                                ) : (
                                    <KeyOutlined className="mr-2" />
                                )}
                                Gửi yêu cầu
                            </button>

                            <div className="login-links">
                                <Link href="/login" className="forgot-password-link">
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </Box>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default ForgotPassword;
