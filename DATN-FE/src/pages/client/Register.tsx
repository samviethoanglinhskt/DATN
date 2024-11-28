import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "src/types/user";
import { message } from "antd";
import axiosInstance from "src/config/axiosInstance";
import "../../assets/css/Register.css";
import { useEffect, useState } from "react";
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "vn-provinces";

interface IProvince {
  code: string; // mã tỉnh
  name: string; // tên tỉnh
}

interface IDistrict {
  code: string; // mã huyện
  name: string; // tên huyện
}

interface IWard {
  code: string; // mã xã
  name: string; // tên xã
}

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

  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    // Lấy danh sách tỉnh
    const provincesData = getProvinces();
    setProvinces(provincesData);
  }, []);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    const province = provinces.find((p) => p.code === provinceCode);
    if (province) {
      const districtsData = getDistrictsByProvinceCode(provinceCode);
      setDistricts(districtsData);
      setWards([]);
      updateAddress(province.name, "province");
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  const updateAddress = (value: string, level: "province" | "district" | "ward") => {
    const parts = selectedAddress.split(", ");
    if (level === "province") {
      setSelectedAddress(`${value}`);
    } else if (level === "district") {
      setSelectedAddress(`${parts[0]}, ${value}`);
    } else if (level === "ward") {
      setSelectedAddress(`${parts[0]}, ${parts[1]}, ${value}`);
    }
  };

  const onSubmit: SubmitHandler<User & { password_confirmation: string }> = async (data) => {
    try {
      const hide = message.loading("Đang xử lý đăng ký...", 0);
      data.address = selectedAddress; // Gán địa chỉ đã chọn vào dữ liệu form
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

              <div className="form-row">
                {/* Tỉnh/Thành phố */}
                <div className="form-group col-md-4">
                  <label htmlFor="province">Tỉnh/Thành phố</label>
                  <select id="province" className="form-control" onChange={handleProvinceChange}>
                    <option value="">Chọn tỉnh/thành</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quận/Huyện */}
                <div className="form-group col-md-4">
                  <label htmlFor="district">Quận/Huyện</label>
                  <select
                    id="district"
                    className="form-control"
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

                {/* Phường/Xã */}
                <div className="form-group col-md-4">
                  <label htmlFor="ward">Phường/Xã</label>
                  <select
                    id="ward"
                    className="form-control"
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

              {/* Địa chỉ */}
              <div className="form-floating mb-3">
                <input
                  value={selectedAddress}
                  type="text"
                  className={`form-control register-input ${errors.address ? 'is-invalid' : ''}`}
                  id="addressInput"
                  placeholder="Địa chỉ"
                  {...register("address")}
                  readOnly
                />
                <label htmlFor="addressInput" className="register-label">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Địa chỉ
                </label>
                {errors.address && (
                  <div className="register-feedback">{errors.address.message}</div>
                )}
              </div>

              {/* Địa chỉ cụ thể*/}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control register-input ${errors.address_detail ? 'is-invalid' : ''}`}
                  id="addressInput"
                  placeholder="Địa chỉ cụ thể"
                  {...register("address_detail", {
                    required: "Vui lòng nhập địa chỉ cụ thể",
                  })}
                />
                <label htmlFor="addressInput" className="register-label">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Địa chỉ cụ thể
                </label>
                {errors.address_detail && (
                  <div className="register-feedback">{errors.address_detail.message}</div>
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