import {
  Box,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "src/types/user";
import axiosInstance from "src/config/axiosInstance";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const response = await axiosInstance.post("/api/login", data);
      console.log("Đăng nhập thành công:", response.data);
      localStorage.setItem("token", response.data.data.token);
      reset();
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
        <button onClick={() => navigate("/")} className="stext-109 cl8 hov-cl1 trans-04">
          Trang chủ
          <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
        </button>
        <span className="stext-109 cl4">Đăng nhập</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: 700,
            margin: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >

          <Typography component="h1" variant="h3">
            Sign in
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  {...register("email", {
                    required: "Required email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email",
                    },
                  })}
                  error={!!errors?.email?.message}
                  helperText={errors?.email?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type="password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Required password",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                  })}
                  error={!!errors?.password?.message}
                  helperText={errors?.password?.message}
                />
              </Grid>
            </Grid>
            <button type="submit" className="flex-c-m stext-101 cl0 size-121 bg3 bor1 hov-btn3 p-lr-15 trans-04 pointer" style={{ marginTop: 30 }}>
              Đăng nhập
            </button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  href="/forgot_password"
                  variant="body2"
                  sx={{ lineHeight: "4" }}
                >
                  Quên mật khẩu?
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/register" variant="body2" sx={{ lineHeight: "2" }}>
                  Chưa có tài khoản? Đăng ký
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </div>

  );
};
export default Login;
