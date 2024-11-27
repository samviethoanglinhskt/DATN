import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, TextField, Button, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useUser } from 'src/context/User';

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

    // Đồng bộ state khi `user` thay đổi
    useEffect(() => {
        if (user?.data?.user) {
            setName(user.data.user.name);
            setPhone(user.data.user.phone);
            setEmail(user.data.user.email);
        }
    }, [user]); // Chỉ chạy khi `user` thay đổi

    const handleSave = async () => {
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
                    />
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        margin="normal"
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
    return (
        <Box p={3} bgcolor="#f9f9f9" borderRadius={2} width={1000}>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Địa chỉ của tôi
            </h1>
            <p className="text-gray-600">
                Quản lý danh sách địa chỉ của bạn
            </p>
            <Box>
                <button className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer" style={{ width: 200, margin: 20 }}>
                    Thêm địa chỉ mới
                </button>
                <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Dương Thắng (+84) 399 325 529
                    </Typography>
                    <Typography>124 Phương Canh, Quận Nam Từ Liêm, Hà Nội</Typography>
                    <Box mt={2}>
                        <Button variant="text" color="secondary">
                            Cập nhật
                        </Button>
                        <Button variant="text" color="error">
                            Xóa
                        </Button>
                        <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
                            Thiết lập mặc định
                        </Button>
                    </Box>
                </Paper>
            </Box>
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
