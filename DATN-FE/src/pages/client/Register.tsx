// Register.tsx
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { User } from "src/types/user";
import { message } from "antd";
import axiosInstance from "src/config/axiosInstance";
import "../../assets/css/Register.css";
import { useEffect, useState } from "react";
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "vn-provinces";

interface IProvince {
 code: string;
 name: string; 
}

interface IDistrict {
 code: string;
 name: string;
}

interface IWard {
 code: string;
 name: string;
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
   const provincesData = getProvinces();
   setProvinces(provincesData);
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
     data.address = selectedAddress;
     const response = await axiosInstance.post("/api/register", data);
     hide();

     if (response.data.success) {
       message.success("Đăng ký thành công! Vui lòng đăng nhập");
       reset();
       setTimeout(() => navigate("/login"), 1500);
     }
   } catch (error: any) {
     message.error(error.response?.data?.message || "Đăng ký thất bại");
   }
 };

 return (
   <div className="register-container">
     <div className="register-content">
       <div className="register-breadcrumb" />

       <div className="register-form-container">
         <div className="register-form-box">
           <h1 className="register-title">Đăng ký tài khoản</h1>

           <form onSubmit={handleSubmit(onSubmit)} className="register-form">
             <div className="form-floating">
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
                 <UserOutlined className="me-2" />
                 Họ và tên
               </label>
               {errors.name && <div className="register-feedback">{errors.name.message}</div>}
             </div>

             <div className="form-floating">
               <input
                 type="email" 
                 className={`form-control register-input ${errors.email ? 'is-invalid' : ''}`}
                 id="emailInput"
                 placeholder="Email"
                 {...register("email", {
                   required: "Vui lòng nhập email",
                   pattern: {
                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                     message: "Email không hợp lệ"
                   }
                 })}
               />
               <label htmlFor="emailInput" className="register-label">
                 <MailOutlined className="me-2" />
                 Email
               </label>
               {errors.email && <div className="register-feedback">{errors.email.message}</div>}
             </div>

             <div className="form-floating">
               <input
                 type="tel"
                 className={`form-control register-input ${errors.phone ? 'is-invalid' : ''}`}
                 id="phoneInput" 
                 placeholder="Số điện thoại"
                 {...register("phone", {
                   required: "Vui lòng nhập số điện thoại",
                   pattern: {
                     value: /^0\d{9}$/,
                     message: "Số điện thoại không hợp lệ"
                   }
                 })}
               />
               <label htmlFor="phoneInput" className="register-label">
                 <PhoneOutlined className="me-2" />
                 Số điện thoại
               </label>
               {errors.phone && <div className="register-feedback">{errors.phone.message}</div>}
             </div>

             <div className="form-row">
               <div className="form-group">
                 <label htmlFor="province">Tỉnh/Thành phố</label>
                 <select id="province" className="form-select" onChange={handleProvinceChange}>
                   <option value="">Chọn tỉnh/thành</option>
                   {provinces.map(province => (
                     <option key={province.code} value={province.code}>
                       {province.name}
                     </option>
                   ))}
                 </select>
               </div>

               <div className="form-group">
                 <label htmlFor="district">Quận/Huyện</label>
                 <select
                   id="district"
                   className="form-select"
                   onChange={handleDistrictChange}
                   disabled={!districts.length}
                 >
                   <option value="">Chọn quận/huyện</option>
                   {districts.map(district => (
                     <option key={district.code} value={district.code}>
                       {district.name}
                     </option>
                   ))}
                 </select>
               </div>

               <div className="form-group">
                 <label htmlFor="ward">Phường/Xã</label>
                 <select
                   id="ward"
                   className="form-select"
                   onChange={handleWardChange}
                   disabled={!wards.length}
                 >
                   <option value="">Chọn phường/xã</option>
                   {wards.map(ward => (
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
                 className={`form-control register-input ${errors.address ? 'is-invalid' : ''}`}
                 id="addressInput"
                 placeholder="Địa chỉ"
                 value={selectedAddress}
                 {...register("address")}
                 readOnly
               />
               <label htmlFor="addressInput" className="register-label">
                 <HomeOutlined className="me-2" />
                 Địa chỉ
               </label>
             </div>

             <div className="form-floating">
               <input
                 type="text"
                 className={`form-control register-input ${errors.address_detail ? 'is-invalid' : ''}`}
                 id="addressDetailInput"
                 placeholder="Địa chỉ cụ thể"
                 {...register("address_detail", {
                   required: "Vui lòng nhập địa chỉ cụ thể"
                 })}
               />
               <label htmlFor="addressDetailInput" className="register-label">
                 <HomeOutlined className="me-2" />
                 Địa chỉ cụ thể
               </label>
               {errors.address_detail && (
                 <div className="register-feedback">{errors.address_detail.message}</div>
               )}
             </div>

             <div className="form-floating">
               <input
                 type="password"
                 className={`form-control register-input ${errors.password ? 'is-invalid' : ''}`}
                 id="passwordInput"
                 placeholder="Mật khẩu"
                 {...register("password", {
                   required: "Vui lòng nhập mật khẩu",
                   minLength: {
                     value: 6, 
                     message: "Mật khẩu phải có ít nhất 6 ký tự"
                   }
                 })}
               />
               <label htmlFor="passwordInput" className="register-label">
                 <LockOutlined className="me-2" />
                 Mật khẩu
               </label>
               {errors.password && (
                 <div className="register-feedback">{errors.password.message}</div>
               )}
             </div>

             <div className="form-floating">  
               <input
                 type="password"
                 className={`form-control register-input ${errors.password_confirmation ? 'is-invalid' : ''}`}
                 id="confirmPasswordInput"
                 placeholder="Xác nhận mật khẩu"
                 {...register("password_confirmation", {
                   required: "Vui lòng xác nhận mật khẩu",
                   validate: value => value === password || "Mật khẩu xác nhận không khớp"
                 })}
               />
               <label htmlFor="confirmPasswordInput" className="register-label">
                 <LockOutlined className="me-2" />
                 Xác nhận mật khẩu
               </label>
               {errors.password_confirmation && (
                 <div className="register-feedback">{errors.password_confirmation.message}</div>
               )}
             </div>

             <button type="submit" className="register-button" disabled={isSubmitting}>
               {isSubmitting ? (
                 <>
                   <span className="spinner-border spinner-border-sm me-2" />
                   Đang xử lý...
                 </>
               ) : (
                 <>
                   <UserOutlined className="me-2" />
                   Đăng ký
                 </>
               )}
             </button>

             <div className="register-links">
               <a href="/login" className="register-login-link">
                 <LockOutlined className="me-1" />
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