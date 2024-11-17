import {
    Box,
    Grid,
    Link,
    TextField,
    Typography
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "src/types/user";
import axiosInstance from "src/config/axiosInstance";

const Register = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm<User & { password_confirmation: string }>();

    const navigate = useNavigate();

    const password = watch("password");

    const onSubmit: SubmitHandler<User & { password_confirmation: string }> = async (data) => {
        try {
            const response = await axiosInstance.post("/api/register", data);
            console.log("User registered successfully:", response.data);
            reset();
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="container mt-5">
            <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                <button onClick={() => navigate("/")} className="stext-109 cl8 hov-cl1 trans-04">
                    Trang chủ
                    <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
                </button>
                <span className="stext-109 cl4">Đăng ký</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                    sx={{
                        width: 600,
                        margin: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    <Typography component="h1" variant="h3">
                        Sign up
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <TextField
                                    autoComplete="given-name"
                                    fullWidth
                                    label="Name"
                                    autoFocus
                                    {...register("name", {
                                        required: "Required name",
                                    })}
                                    error={!!errors?.name?.message}
                                    helperText={errors?.name?.message}
                                />
                            </Grid>

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
                                    label="Phone"
                                    autoComplete="phone"
                                    {...register("phone", {
                                        required: "Required phone",
                                        pattern: {
                                            value: /^0\d{9}$/,
                                            message: "Invalid phone",
                                        },
                                    })}
                                    error={!!errors?.phone?.message}
                                    helperText={errors?.phone?.message}
                                />
                            </Grid>

                            <Grid item xs={12} >
                                <TextField
                                    autoComplete="address"
                                    fullWidth
                                    label="Address"
                                    autoFocus
                                    {...register("address", {
                                        required: "Required address",
                                    })}
                                    error={!!errors?.address?.message}
                                    helperText={errors?.address?.message}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
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

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Re-Password"
                                    type="password"
                                    autoComplete="confirm-password"
                                    {...register("password_confirmation", {
                                        required: "Required re-password",
                                        validate: (value) =>
                                            value === password || "Re-password do not match with password",
                                    })}
                                    error={!!errors?.password_confirmation?.message}
                                    helperText={errors?.password_confirmation?.message}

                                />
                            </Grid>

                        </Grid>
                        <button type="submit" className="flex-c-m stext-101 cl0 size-121 bg3 bor1 hov-btn3 p-lr-15 trans-04 pointer" style={{ marginTop: 30 }}>
                            Đăng ký
                        </button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2" sx={{ lineHeight: '4' }}>
                                    Đã có tài khoản? Đăng nhập
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </div>

        </div>
    );
};

export default Register;
