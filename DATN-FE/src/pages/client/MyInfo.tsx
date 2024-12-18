import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, TextField, Button, Typography, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/system';
import { useUser } from 'src/context/User';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Address } from 'src/types/user';
import { getDistrictsByProvinceCode, getProvinces, getWardsByDistrictCode } from 'vn-provinces';
import { IDistrict, IProvince, IWard } from 'src/types/address';
import { enqueueSnackbar, useSnackbar } from "notistack";

const SidebarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: theme.spacing(2),
}));

// Component hồ sơ
const Profile = () => {
    const { enqueueSnackbar } = useSnackbar();
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
        if (!validate()) return;
        try {
            const response = await updateUser({ name, phone, email });
            console.log(response);
            enqueueSnackbar("Cập nhật thông tin thành công!", { variant: "info" });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
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

const ResetPass = () => {
    const { user, resetPassword } = useUser(); // Giả sử resetPassword là hàm trong context để gọi API
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const validate = () => {
        const newErrors = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        };

        // Kiểm tra mật khẩu hiện tại
        if (!currentPassword.trim()) {
            newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
        }

        // Kiểm tra mật khẩu mới (tối thiểu 6 ký tự)
        if (!newPassword.trim()) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
        } else if (newPassword.length < 6) {
            newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
        }

        // Kiểm tra xác nhận mật khẩu
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        }

        setErrors(newErrors);

        // Trả về true nếu không có lỗi
        return Object.values(newErrors).every((error) => error === "");
    };


    const handleSave = async () => {
        if (!validate()) return;
        try {
            await resetPassword({
                current_password: currentPassword,
                new_password: newPassword,
            });
            enqueueSnackbar("Cập nhật mật khẩu thành công", { variant: "success" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Đổi mật khẩu thất bại:", error);
            setErrors((prev) => ({
                ...prev,
                currentPassword: error.message || "Mật khẩu hiện tại không đúng.",
            }));
        }
    };


    if (!user) {
        return (
            <Box p={3} bgcolor="#f9f9f9" borderRadius={2} width={1000}>
                <Typography variant="h5" color="error">
                    Bạn cần đăng nhập để đổi mật khẩu.
                </Typography>
            </Box>
        );
    }

    return (
        <div>
            <Box p={3} bgcolor="#f9f9f9" borderRadius={2} width={1000}>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Đổi mật khẩu
                </h1>
                <p className="text-gray-600">
                    Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi.
                </p>
                <Box component="form">
                    <TextField
                        label="Mật khẩu hiện tại"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword}
                    />
                    <TextField
                        label="Mật khẩu mới"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!errors.newPassword}
                        helperText={errors.newPassword}
                    />
                    <TextField
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                        style={{ width: 200, marginTop: 20 }}
                    >
                        Đổi mật khẩu
                    </button>
                </Box>
            </Box>
        </div>
    );
};

const AddressList = () => {
    const { user, addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useUser();
    const [open, setOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address: '',
        address_detail: '',
    });
    const [provinces, setProvinces] = useState<IProvince[]>([]);
    const [districts, setDistricts] = useState<IDistrict[]>([]);
    const [wards, setWards] = useState<IWard[]>([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [addressToUpdate, setAddressToUpdate] = useState<Address | null>(null);
    const [openDialog, setOpenDialog] = useState(false); // Quản lý trạng thái mở Dialog
    const [addressIdToDelete, setAddressIdToDelete] = useState<number | null>(null); // Lưu id của địa chỉ cần xóa

    // Hàm mở Dialog và lưu id địa chỉ cần xóa
    const handleOpenDeleteDialog = (id: number) => {
        setAddressIdToDelete(id);
        setOpenDialog(true);
    };

    // Hàm đóng Dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setAddressIdToDelete(null);
    };

    useEffect(() => {
        // Chỉ cập nhật selectedAddress nếu là cập nhật địa chỉ từ user
        if (user && !addressToUpdate) {
            setSelectedAddress(user?.data?.address?.[0]?.address || '');
        }
    }, [user, addressToUpdate]);


    const handleClickOpen = (address?: Address) => {
        setAddressToUpdate(address || null);

        if (address) {
            // Nếu là cập nhật, hiển thị dữ liệu của địa chỉ đó
            setNewAddress({
                address: address.address,
                address_detail: address.address_detail,
            });
            setSelectedAddress(address.address);  // Hiển thị địa chỉ chính xác khi cập nhật
        } else {
            // Nếu là thêm mới, đặt lại mọi trường thành trống
            setNewAddress({
                address: '',
                address_detail: '',
            });
            setSelectedAddress('');  // Đặt lại địa chỉ trống khi thêm mới
        }

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setAddressToUpdate(null);
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
            updateSelectedAddress(province.name, "province");
        }
    };

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtCode = e.target.value;
        const district = districts.find((d) => d.code === districtCode);
        if (district) {
            const wardsData = getWardsByDistrictCode(districtCode);
            setWards(wardsData);
            updateSelectedAddress(district.name, "district");
        }
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardCode = e.target.value;
        const ward = wards.find((w) => w.code === wardCode);
        if (ward) {
            updateSelectedAddress(ward.name, "ward");
        }
    };

    const updateSelectedAddress = (value: string, level: "province" | "district" | "ward") => {
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
        setNewAddress((prev) => ({
            ...prev,
            address: newSelectedAddress,
        }));
    };

    const handleAddAddress = async () => {
        try {
            const newAddressData = {
                address: newAddress.address,
                address_detail: newAddress.address_detail,
            };
            await addAddress(newAddressData);
            setNewAddress({
                address: '',
                address_detail: '',
            });
            handleClose();
            enqueueSnackbar("Thêm địa chỉ thành công!", { variant: "success" });
        } catch (error) {
            console.error('Lỗi khi thêm địa chỉ:', error);
        }
    };

    const handleUpdateAddress = async () => {
        if (addressToUpdate) {
            try {
                const updatedAddressData = {
                    address: newAddress.address,
                    address_detail: newAddress.address_detail,
                };
                await updateAddress(addressToUpdate.id, updatedAddressData);
                setNewAddress({ address: '', address_detail: '' });
                handleClose();
                enqueueSnackbar("Cập nhật địa chỉ thành công!", { variant: "success" });
            } catch (error) {
                console.error('Lỗi khi cập nhật địa chỉ:', error);
            }
        }
    };

    const handleDeleteAddress = async () => {
        if (!addressIdToDelete) return;

        try {
            await deleteAddress(addressIdToDelete); // Xóa địa chỉ
            enqueueSnackbar("Xóa địa chỉ thành công!", { variant: "success" });
            handleCloseDialog(); // Đóng Dialog sau khi xóa thành công
        } catch (error) {
            console.error("Lỗi khi xóa địa chỉ:", error);
            handleCloseDialog(); // Đóng Dialog nếu có lỗi
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultAddress(id);
            enqueueSnackbar("Đặt địa chỉ mặc định thành công!", { variant: "success" });
        } catch (error) {
            console.error('Lỗi khi đặt địa chỉ mặc định:', error);
        }
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
                    onClick={() => handleClickOpen()}
                >
                    Thêm địa chỉ mới
                </button>

                {addresses
                    .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
                    .map((address) => (
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
                                <Button variant="text" color="secondary" onClick={() => handleClickOpen(address)}>
                                    Cập nhật
                                </Button>
                                {!address.is_default &&
                                    <Button onClick={() => handleOpenDeleteDialog(address.id)} color="error">
                                        Xóa địa chỉ
                                    </Button>
                                }

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ ml: 2 }}
                                    onClick={() => handleSetDefault(address.id)}
                                    disabled={!!address.is_default}
                                >
                                    Đặt làm mặc định
                                </Button>
                            </Box>
                        </Paper>
                    ))}
            </Box>

            {/* Modal thêm địa chỉ mới */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{addressToUpdate ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
                <DialogContent>
                    <div className="form-row">
                        {/* Tỉnh/Thành phố */}
                        <div className="form-group col-md-4">
                            <label htmlFor="province">Tỉnh/Thành phố</label>
                            <select style={{ width: 150 }} id="province" className="form-control" onChange={handleProvinceChange}>
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
                                style={{ width: 150, marginTop: 20 }}
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
                                style={{ width: 150, marginTop: 20 }}
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
                            value={newAddress.address_detail}
                            type="text"
                            className={`form-control register-input`}
                            id="addressInput"
                            placeholder=""
                            name="address_detail"
                            onChange={handleInputChange}
                        />
                        <label htmlFor="addressInput" className="register-label">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Địa chỉ cụ thể
                        </label>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Hủy
                    </Button>
                    <Button onClick={addressToUpdate ? handleUpdateAddress : handleAddAddress} color="primary">
                        {addressToUpdate ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xác nhận xóa */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Xác nhận xóa địa chỉ</DialogTitle>
                <DialogContent>
                    Bạn có chắc chắn muốn xóa địa chỉ này?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteAddress} color="error" variant="contained">
                        Xóa
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
                                        backgroundColor: '#717FE0',
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
                                    label="Đổi mật khẩu"
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
                                <Tab
                                    label="Địa chỉ"
                                    sx={{
                                        borderRadius: 10,
                                        width: 200,
                                        alignItems: 'flex-start',
                                        backgroundColor: tab === 2 ? '#D2E2F2' : 'transparent',
                                        color: tab === 2 ? '#D2E2F2' : 'black',
                                        '&:hover': {
                                            backgroundColor: tab === 2 ? '#D2E2F2' : '#D2E2F2',
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
                    {tab === 1 && <ResetPass />}
                    {tab === 2 && <AddressList />}
                </Grid>
            </Grid>
        </div>

    );
};

export default MyInfo;