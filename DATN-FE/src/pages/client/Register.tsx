import {
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    Link,
    styled,
    TextField,
    Typography
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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


    const GradientButton = styled(Button)(() => ({
        background: 'linear-gradient(45deg, #FE6B8B 50%, white 90%)',
        backgroundSize: '200% 200%',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        width: 600,
        marginTop: '20px',
        padding: '0 30px',
        transition: 'background-position 1s ease',
        backgroundPosition: '0% 100%',
        '&:hover': {
            backgroundPosition: '200% 100%',
        },
    }));

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    margin: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>

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
                    <GradientButton type="submit">
                        Sign up
                    </GradientButton>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2" sx={{ lineHeight: '4' }}>
                                Already have an account? Sign in here
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
