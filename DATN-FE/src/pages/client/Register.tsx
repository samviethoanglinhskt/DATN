import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "src/types/user";
import { message } from "antd";
import axiosInstance from "src/config/axiosInstance";
import "../../assets/css/Register.css";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<User & { password_confirmation: string }>();

  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit: SubmitHandler<User & { password_confirmation: string }> = async (data) => {
    try {
      const hide = message.loading("Đang xử lý đăng ký...", 0);
      const response = await axiosInstance.post("/api/register", data);
      hide();

      if (response.data.success) {
        message.success({
          content: "Đăng ký thành công! Vui lòng đăng nhập",
          duration: 2,
        });
        reset();
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error: any) {
      message.error({
        content: error.response?.data?.message || "Đăng ký thất bại",
        duration: 3,
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-breadcrumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
        </div>

        <div className="register-form-container">
          <div className="register-form-box">
            <h1 className="register-title">Đăng ký tài khoản</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="register-form">
              {/* Họ và tên */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control register-input ${errors.name ? 'is-invalid' : ''}`}
                  id="nameInput"
                  placeholder="Họ và tên"
                  {...register("name", {
                    required: "Vui lòng nhập họ tên",
                    minLength: {
                      value: 2,
                      message: "Họ tên phải có ít nhất 2 ký tự"
                    }
                  })}
                />
                <label htmlFor="nameInput" className="register-label">
                  <i className="fas fa-user me-2"></i>
                  Họ và tên
                </label>
                {errors.name && (
                  <div className="register-feedback">{errors.name.message}</div>
                )}
              </div>

              {/* Email */}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className={`form-control register-input ${errors.email ? 'is-invalid' : ''}`}
                  id="emailInput"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Vui lòng nhập email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                <label htmlFor="emailInput" className="register-label">
                  <i className="fas fa-envelope me-2"></i>
                  Email
                </label>
                {errors.email && (
                  <div className="register-feedback">{errors.email.message}</div>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="form-floating mb-3">
                <input
                  type="tel"
                  className={`form-control register-input ${errors.phone ? 'is-invalid' : ''}`}
                  id="phoneInput"
                  placeholder="Số điện thoại"
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: /^0\d{9}$/,
                      message: "Số điện thoại không hợp lệ (10 số, bắt đầu bằng số 0)",
                    },
                  })}
                />
                <label htmlFor="phoneInput" className="register-label">
                  <i className="fas fa-phone me-2"></i>
                  Số điện thoại
                </label>
                {errors.phone && (
                  <div className="register-feedback">{errors.phone.message}</div>
                )}
              </div>

              {/* Địa chỉ */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control register-input ${errors.address ? 'is-invalid' : ''}`}
                  id="addressInput"
                  placeholder="Địa chỉ"
                  {...register("address", {
                    required: "Vui lòng nhập địa chỉ",
                    minLength: {
                      value: 5,
                      message: "Địa chỉ phải có ít nhất 5 ký tự"
                    }
                  })}
                />
                <label htmlFor="addressInput" className="register-label">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Địa chỉ
                </label>
                {errors.address && (
                  <div className="register-feedback">{errors.address.message}</div>
                )}
              </div>

              {/* Mật khẩu */}
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className={`form-control register-input ${errors.password ? 'is-invalid' : ''}`}
                  id="passwordInput"
                  placeholder="Mật khẩu"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                      message: "Mật khẩu phải chứa chữ hoa, chữ thường và số",
                    },
                  })}
                />
                <label htmlFor="passwordInput" className="register-label">
                  <i className="fas fa-lock me-2"></i>
                  Mật khẩu
                </label>
                {errors.password && (
                  <div className="register-feedback">{errors.password.message}</div>
                )}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className={`form-control register-input ${errors.password_confirmation ? 'is-invalid' : ''}`}
                  id="confirmPasswordInput"
                  placeholder="Xác nhận mật khẩu"
                  {...register("password_confirmation", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (value) =>
                      value === password || "Mật khẩu xác nhận không khớp",
                  })}
                />
                <label htmlFor="confirmPasswordInput" className="register-label">
                  <i className="fas fa-lock me-2"></i>
                  Xác nhận mật khẩu
                </label>
                {errors.password_confirmation && (
                  <div className="register-feedback">
                    {errors.password_confirmation.message}
                  </div>
                )}
              </div>

              {/* Nút đăng ký */}
              <button 
                type="submit" 
                className="register-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus me-2"></i>
                    Đăng ký
                  </>
                )}
              </button>

              {/* Link đăng nhập */}
              <div className="register-links">
                <a href="/login" className="register-login-link">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Đã có tài khoản? Đăng nhập
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;