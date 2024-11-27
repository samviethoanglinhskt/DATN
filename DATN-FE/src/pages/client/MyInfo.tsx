import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, TextField, Button, Typography, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/system';
import { useUser } from 'src/context/User';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Address } from 'src/types/user';
import { getDistrictsByProvinceCode, getProvinces, getWardsByDistrictCode } from 'vn-provinces';
import axiosInstance from 'src/config/axiosInstance';

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

const SidebarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: theme.spacing(2),
}));

// Component hồ sơ
const Profile = () => {
    const { user, updateUser } = useUser();
    // Khởi tạo state với giá trị mặc định rỗng
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // State cho lỗi
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
    });

    // Đồng bộ state khi `user` thay đổi
    useEffect(() => {
        if (user?.data?.user) {
            setName(user.data.user.name);
            setPhone(user.data.user.phone);
            setEmail(user.data.user.email);
        }
    }, [user]); // Chỉ chạy khi `user` thay đổi

    // Hàm kiểm tra lỗi của từng trường
    const validate = () => {
        const newErrors = {
            name: "",
            email: "",
            phone: "",
        };

        // Kiểm tra trường name
        if (!name.trim()) {
            newErrors.name = "Tên không được để trống.";
        }

        // Kiểm tra trường email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email không được để trống.";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Email không đúng định dạng.";
        }

        // Kiểm tra trường phone
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone.trim()) {
            newErrors.phone = "Số điện thoại không được để trống.";
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = "Số điện thoại phải là 10 chữ số.";
        }

        setErrors(newErrors);

        // Trả về true nếu không có lỗi nào
        return Object.values(newErrors).every((error) => error === "");
    };

    const handleSave = async () => {
        if (!validate()) return; // Không thực hiện nếu có lỗi
        try {
            await updateUser({ name, phone, email });
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Cập nhật thông tin thất bại:", error);
        }
    };

    if (!user) {
        return (
            <Box p={3} bgcolor="#f9f9f9" borderRadius={2} width={1000}>
                <Typography variant="h5" color="error">
                    Bạn cần đăng nhập để xem thông tin hồ sơ.
                </Typography>
            </Box>
        );
    }

    return (
        <div>
            <Box p={3} bgcolor="#f9f9f9" borderRadius={2} width={1000}>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Hồ sơ của tôi
                </h1>
                <p className="text-gray-600">
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
                <Box component="form">
                    <TextField
                        label="Tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                    <button
                        type='button'
                        onClick={handleSave}
                        className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer" style={{ width: 200, marginTop: 20 }}>
                        Lưu
                    </button>
                </Box>
            </Box>
        </div>

    );
};

// Component danh sách địa chỉ
const AddressList = () => {
    const { user } = useUser();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [open, setOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address: '',
        address_detail: '',
    });
    const [provinces, setProvinces] = useState<IProvince[]>([]);
    const [districts, setDistricts] = useState<IDistrict[]>([]);
    const [wards, setWards] = useState<IWard[]>([]);
    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(() => {
        setAddresses(user?.data.address);
    }, [user]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddAddress = async () => {
        try {
            // Tạo đối tượng dữ liệu gửi lên API
            const newAddressData = {
                address: newAddress.address,
                address_detail: newAddress.address_detail,
            };
            console.log(newAddressData);
            const response = await axiosInstance.post('/api/address', newAddressData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                // Cập nhật lại địa chỉ sau khi thêm thành công
                setAddresses([...addresses, response.data.data]);
                setNewAddress({
                    address: '',
                    address_detail: '',
                });
                handleClose();
            } else {
                alert('Thêm địa chỉ không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi thêm địa chỉ:', error);
            alert('Đã xảy ra lỗi khi thêm địa chỉ');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
        let newSelectedAddress = "";

        if (level === "province") {
            newSelectedAddress = `${value}`;
        } else if (level === "district") {
            newSelectedAddress = `${parts[0]}, ${value}`;
        } else if (level === "ward") {
            newSelectedAddress = `${parts[0]}, ${parts[1]}, ${value}`;
        }

        setSelectedAddress(newSelectedAddress);

        // Cập nhật vào state newAddress
        setNewAddress((prev) => ({
            ...prev,
            address: newSelectedAddress,
        }));
    };

    return (
        <Box p={3} bgcolor="#f9f9f9" borderRadius={2} width={1000}>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Địa chỉ của tôi
            </h1>
            <p className="text-gray-600">
                Quản lý danh sách địa chỉ của bạn
            </p>
            <Box>
                <button
                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                    style={{ width: 200, margin: 20 }}
                    type='button'
                    onClick={handleClickOpen}
                >
                    Thêm địa chỉ mới
                </button>

                {addresses.map((address) => (
                    <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }} key={address.id}>
                        <Typography fontSize={18} fontWeight={'normal'}> <LocationOnOutlinedIcon />{address.address_detail}</Typography>
                        <Typography fontSize={18} fontWeight={'bold'}> {address.address}</Typography>
                        {address.is_default == true && (
                            <Typography
                                sx={{
                                    display: "inline-block",
                                    padding: "5px 10px",
                                    border: "1px solid #1998E2",
                                    color: "#1998E2",
                                    borderRadius: "4px",
                                    marginTop: 1
                                }}
                            >
                                Mặc định
                            </Typography>
                        )}
                        <Box mt={2}>
                            <Button variant="text" color="secondary">
                                Cập nhật
                            </Button>
                            <Button variant="text" color="error">
                                Xóa
                            </Button>
                            <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
                                Đặt làm mặc định
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </Box>

            {/* Modal thêm địa chỉ mới */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                <DialogContent>
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
                            className={`form-control register-input`}
                            id="addressInput"
                            placeholder=""
                            name="address"
                            readOnly
                        />
                        <label htmlFor="addressInput" className="register-label">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Địa chỉ
                        </label>
                    </div>

                    {/* Địa chỉ cụ thể*/}
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className={`form-control register-input`}
                            id="addressInput"
                            placeholder=""
                            name="address_detail"
                            value={newAddress.address_detail}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="addressInput" className="register-label">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Địa chỉ cụ thể
                        </label>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleAddAddress} color="primary">
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const MyInfo = () => {
    const [tab, setTab] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (

        <div>
            <div className="container" style={{ marginTop: 80 }}>
                <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
                    <a href="/" className="stext-109 cl8 hov-cl1 trans-04">
                        Trang chủ
                        <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true" />
                    </a>
                    <span className="stext-109 cl4">
                        Tài khoản của tôi
                    </span>
                </div>
            </div>

            <Grid container spacing={1} sx={{ margin: "50px 0" }}>
                {/* Thanh điều hướng bên trái */}
                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end" }}>
                    <Paper elevation={3} sx={{ height: '100%', width: 200 }}>
                        <SidebarContainer>
                            <Tabs
                                orientation="vertical"
                                value={tab}
                                onChange={handleChange}
                                indicatorColor="primary"
                                sx={{
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: '#717FE0', // Màu đỏ cho indicator
                                    },
                                }}
                            >
                                <Tab
                                    label="Hồ sơ"
                                    sx={{
                                        borderRadius: 10,
                                        width: 200,
                                        alignItems: 'flex-start',
                                        backgroundColor: tab === 0 ? '#D2E2F2' : 'transparent',
                                        color: tab === 0 ? '#FFFFFF' : 'black',
                                        '&:hover': {
                                            backgroundColor: tab === 0 ? '#D2E2F2' : '#D2E2F2',
                                        },
                                    }}
                                />
                                <Tab
                                    label="Địa chỉ"
                                    sx={{
                                        borderRadius: 10,
                                        width: 200,
                                        alignItems: 'flex-start',
                                        backgroundColor: tab === 1 ? '#D2E2F2' : 'transparent',
                                        color: tab === 1 ? '#D2E2F2' : 'black',
                                        '&:hover': {
                                            backgroundColor: tab === 1 ? '#D2E2F2' : '#D2E2F2',
                                        },
                                    }}
                                />
                            </Tabs>
                        </SidebarContainer>
                    </Paper>
                </Grid>

                {/* Nội dung chính */}
                <Grid item xs={9}>
                    {tab === 0 && <Profile />}
                    {tab === 1 && <AddressList />}
                </Grid>
            </Grid>
        </div>

    );
};

export default MyInfo;
