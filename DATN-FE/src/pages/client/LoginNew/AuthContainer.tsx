import React, { useState, useEffect } from "react";
import { TextField, Grid } from "@mui/material";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  HomeOutlined,
  LoadingOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/config/axiosInstance";
import { User } from "src/types/user";
import { IDistrict, IProvince, IWard } from "src/types/address";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "vn-provinces";
import "./auth.css";

const AuthContainer: React.FC = () => {
  // Toggle states
  const [isSignIn, setIsSignIn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Address states
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const navigate = useNavigate();

  // Form handling for login
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    reset: loginReset,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<User>();

  // Form handling for signup
  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    reset: signupReset,
    watch,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
  } = useForm<User & { password_confirmation: string }>();

  const password = watch("password");

  useEffect(() => {
    setMounted(true);
    const containerTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const provincesData = getProvinces();
    setProvinces(provincesData);

    return () => clearTimeout(containerTimeout);
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    const province = provinces.find((p) => p.code === provinceCode);
    if (province) {
      const districtsData = getDistrictsByProvinceCode(provinceCode);
      setDistricts(districtsData);
      setWards([]);
      updateAddress(province.name, "province");
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value;
    const district = districts.find((d) => d.code === districtCode);
    if (district) {
      const wardsData = getWardsByDistrictCode(districtCode);
      setWards(wardsData);
      updateAddress(district.name, "district");
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;
    const ward = wards.find((w) => w.code === wardCode);
    if (ward) {
      updateAddress(ward.name, "ward");
    }
  };

  const updateAddress = (
    value: string,
    level: "province" | "district" | "ward"
  ) => {
    const parts = selectedAddress.split(", ");
    if (level === "province") {
      setSelectedAddress(`${value}`);
    } else if (level === "district") {
      setSelectedAddress(`${parts[0]}, ${value}`);
    } else if (level === "ward") {
      setSelectedAddress(`${parts[0]}, ${parts[1]}, ${value}`);
    }
  };

  const toggle = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsSignIn(!isSignIn);
      setIsVisible(true);
      loginReset();
      signupReset();
    }, 500);
  };

  const onLogin: SubmitHandler<User> = async (data) => {
    try {
      const hide = message.loading("Đang đăng nhập...", 0);
      const response = await axiosInstance.post("/api/login", data);
      hide();

      if (response.data.success) {
        message.success("Đăng nhập thành công!");
        sessionStorage.setItem("token", response.data.data.token);
        loginReset();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/");
        window.location.reload();
      } else {
        message.error(response.data.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Lỗi kết nối server");
      console.error("Login error:", error);
    }
  };

  const onSignup: SubmitHandler<
    User & { password_confirmation: string }
  > = async (data) => {
    try {
      const hide = message.loading("Đang xử lý đăng ký...", 0);
      data.address = selectedAddress;
      const response = await axiosInstance.post("/api/register", data);
      hide();

      if (response.data.success) {
        message.success("Đăng ký thành công! Vui lòng đăng nhập");
        signupReset();
        toggle(); // Switch to login form
      } else {
        message.error(response.data.message || "Đăng ký thất bại");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Đăng ký thất bại");
      console.error("Register error:", error);
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`containerauth ${isSignIn ? "sign-in" : "sign-up"} ${
        isVisible ? "visible" : ""
      }`}
    >
      <div className="row">
        {/* SIGN UP */}
        <div
          className={`col align-items-center flex-col sign-up ${
            !isSignIn && isVisible ? "visible" : ""
          }`}
        >
          <div className="form-wrapper align-items-center">
            <div
              className={`form sign-up ${
                !isSignIn && isVisible ? "visible" : ""
              }`}
            >
              <form
                onSubmit={handleSignupSubmit(onSignup)}
                className="register-form"
              >
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control register-input ${
                      signupErrors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Họ và tên"
                    {...signupRegister("name", {
                      required: "Vui lòng nhập họ tên",
                      minLength: {
                        value: 2,
                        message: "Họ tên phải có ít nhất 2 ký tự",
                      },
                    })}
                  />
                  <label className="register-label">
                    <UserOutlined className="me-2" />
                    Họ và tên
                  </label>
                  {signupErrors.name && (
                    <div className="register-feedback">
                      {signupErrors.name.message}
                    </div>
                  )}
                </div>

                <div className="form-floating">
                  <input
                    type="email"
                    className={`form-control register-input ${
                      signupErrors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                    {...signupRegister("email", {
                      required: "Vui lòng nhập email",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email không hợp lệ",
                      },
                    })}
                  />
                  <label className="register-label">
                    <MailOutlined className="me-2" />
                    Email
                  </label>
                  {signupErrors.email && (
                    <div className="register-feedback">
                      {signupErrors.email.message}
                    </div>
                  )}
                </div>

                <div className="form-floating">
                  <input
                    type="tel"
                    className={`form-control register-input ${
                      signupErrors.phone ? "is-invalid" : ""
                    }`}
                    placeholder="Số điện thoại"
                    {...signupRegister("phone", {
                      required: "Vui lòng nhập số điện thoại",
                      pattern: {
                        value: /^0\d{9}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                  />
                  <label className="register-label">
                    <PhoneOutlined className="me-2" />
                    Số điện thoại
                  </label>
                  {signupErrors.phone && (
                    <div className="register-feedback">
                      {signupErrors.phone.message}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tỉnh/Thành phố</label>
                    <select
                      className="form-select"
                      onChange={handleProvinceChange}
                    >
                      <option value="">Chọn tỉnh/thành</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Quận/Huyện</label>
                    <select
                      className="form-select"
                      onChange={handleDistrictChange}
                      disabled={!districts.length}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Phường/Xã</label>
                    <select
                      className="form-select"
                      onChange={handleWardChange}
                      disabled={!wards.length}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control register-input"
                    placeholder="Địa chỉ"
                    value={selectedAddress}
                    {...signupRegister("address")}
                    readOnly
                  />
                  <label className="register-label">
                    <HomeOutlined className="me-2" />
                    Địa chỉ
                  </label>
                </div>

                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control register-input ${
                      signupErrors.address_detail ? "is-invalid" : ""
                    }`}
                    placeholder="Địa chỉ cụ thể"
                    {...signupRegister("address_detail", {
                      required: "Vui lòng nhập địa chỉ cụ thể",
                    })}
                  />
                  <label className="register-label">
                    <HomeOutlined className="me-2" />
                    Địa chỉ cụ thể
                  </label>
                  {signupErrors.address_detail && (
                    <div className="register-feedback">
                      {signupErrors.address_detail.message}
                    </div>
                  )}
                </div>

                <div className="form-floating">
                  <input
                    type="password"
                    className={`form-control register-input ${
                      signupErrors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Mật khẩu"
                    {...signupRegister("password", {
                      required: "Vui lòng nhập mật khẩu",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                  />
                  <label className="register-label">
                    <LockOutlined className="me-2" />
                    Mật khẩu
                  </label>
                  {signupErrors.password && (
                    <div className="register-feedback">
                      {signupErrors.password.message}
                    </div>
                  )}
                </div>

                <div className="form-floating">
                  <input
                    type="password"
                    className={`form-control register-input ${
                      signupErrors.password_confirmation ? "is-invalid" : ""
                    }`}
                    placeholder="Xác nhận mật khẩu"
                    {...signupRegister("password_confirmation", {
                      required: "Vui lòng xác nhận mật khẩu",
                      validate: (value) =>
                        value === password || "Mật khẩu xác nhận không khớp",
                    })}
                  />
                  <label className="register-label">
                    <LockOutlined className="me-2" />
                    Xác nhận mật khẩu
                  </label>
                  {signupErrors.password_confirmation && (
                    <div className="register-feedback">
                      {signupErrors.password_confirmation.message}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="register-button"
                  disabled={isSignupSubmitting}
                >
                  {isSignupSubmitting ? (
                    <>
                      <LoadingOutlined className="me-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <UserOutlined className="me-2" />
                      Đăng ký
                    </>
                  )}
                </button>

                <p>
                  <span>Đã có tài khoản?</span>
                  <b onClick={toggle} className="pointer">
                    Đăng nhập ngay
                  </b>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* SIGN IN */}
        <div
          className={`col align-items-center flex-col sign-in ${
            isSignIn && isVisible ? "visible" : ""
          }`}
        >
          <div className="form-wrapper align-items-center">
            <div
              className={`form sign-in ${
                isSignIn && isVisible ? "visible" : ""
              }`}
            >
              <form onSubmit={handleLoginSubmit(onLogin)}>
                <div className="form-floating">
                  <input
                    type="email"
                    className={`form-control register-input ${
                      loginErrors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                    {...loginRegister("email", {
                      required: "Vui lòng nhập email",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email không hợp lệ",
                      },
                    })}
                  />
                  <label className="register-label">
                    <MailOutlined className="me-2" />
                    Email
                  </label>
                  {loginErrors.email && (
                    <div className="register-feedback">
                      {loginErrors.email.message}
                    </div>
                  )}
                </div>

                <div className="form-floating">
                  <input
                    type="password"
                    className={`form-control register-input ${
                      loginErrors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Mật khẩu"
                    {...loginRegister("password", {
                      required: "Vui lòng nhập mật khẩu",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                  />
                  <label className="register-label">
                    <LockOutlined className="me-2" />
                    Mật khẩu
                  </label>
                  {loginErrors.password && (
                    <div className="register-feedback">
                      {loginErrors.password.message}
                    </div>
                  )}
                </div>

                <div className="remember-forgot">
                  <label>
                    <input type="checkbox" />
                    <span>Ghi nhớ tài khoản</span>
                  </label>
                  <a href="/forgot-password">Quên mật khẩu?</a>
                </div>

                <button
                  type="submit"
                  className="register-button"
                  disabled={isLoginSubmitting}
                >
                  {isLoginSubmitting ? (
                    <>
                      <LoadingOutlined className="me-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <LoginOutlined className="me-2" />
                      Đăng nhập
                    </>
                  )}
                </button>

                <p>
                  <span>Chưa có tài khoản?</span>
                  <b onClick={toggle} className="pointer">
                    Đăng ký ngay
                  </b>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="row content-row">
        <div
          className={`col align-items-center flex-col ${
            isSignIn && isVisible ? "visible" : ""
          }`}
        >
          <div className="text sign-in">
            <h2>Chào mừng trở lại</h2>
            <p>Đăng nhập để tiếp tục trải nghiệm</p>
          </div>
          <div className="img sign-in"></div>
        </div>

        <div
          className={`col align-items-center flex-col ${
            !isSignIn && isVisible ? "visible" : ""
          }`}
        >
          <div className="img sign-up"></div>
          <div className="text sign-up">
            <h2>Tạo tài khoản</h2>
            <p>Tham gia cùng chúng tôi để có những trải nghiệm tốt nhất</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
