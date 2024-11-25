import { Box, Grid, Link, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "src/types/user";
import axiosInstance from "src/config/axiosInstance";
import { message } from "antd";
import "../../assets/css/Login.css";
import {
  MailOutlined,
  LockOutlined,
  KeyOutlined,
  UserAddOutlined,
  LoadingOutlined,
  LoginOutlined,
} from "@ant-design/icons";
const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<User>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const hide = message.loading("Đang đăng nhập...", 0);
      const response = await axiosInstance.post("/api/login", data);
      hide();

      if (response.data.success) {
        message.success({
          content: "Đăng nhập thành công!",
          icon: (
            <i className="fas fa-check-circle" style={{ color: "#52c41a" }} />
          ),
          duration: 2,
        });
        localStorage.setItem("token", response.data.data.token);
        reset();

        // Sử dụng Promise để đảm bảo animation hoàn thành
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/");
        window.location.reload();
      } else {
        message.error({
          content: response.data.message || "Đăng nhập thất bại",
          duration: 3,
        });
      }
    } catch (error: any) {
      message.error({
        content: error.response?.data?.message || "Lỗi kết nối server",
        duration: 3,
      });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg"></div>

        <Box className="login-form-container">
          <Box className="login-form-box">
            <Typography component="h1" variant="h3" className="login-title">
              Đăng nhập
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

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    type="password"
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    error={!!errors?.password}
                    helperText={errors?.password?.message}
                    InputProps={{
                      startAdornment: <LockOutlined className="input-icon" />,
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
                  <LoginOutlined className="mr-2" />
                )}
                Đăng nhập
              </button>

              <div className="login-links">
                <Link href="/forgot_password" className="forgot-password-link">
                  <KeyOutlined className="mr-1" />
                  Quên mật khẩu?
                </Link>

                <Link href="/register" className="register-link">
                  <UserAddOutlined className="mr-1" />
                  Chưa có tài khoản? Đăng ký
                </Link>
              </div>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Login;
