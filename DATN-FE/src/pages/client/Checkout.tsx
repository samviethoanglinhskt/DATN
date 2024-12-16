import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, List, ListItem, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from 'src/context/User';
import { Variant } from 'src/types/product';
import logoVoucher from 'src/assets/images/logo/logodiscount.png';
import axiosInstance from 'src/config/axiosInstance';
import { Discount } from 'src/types/discount';
import { Address } from 'src/types/user';
import { getDistrictsByProvinceCode, getProvinces, getWardsByDistrictCode } from 'vn-provinces';
import { IDistrict, IProvince, IWard } from 'src/types/address';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useLoading } from 'src/context/LoadingContext';
import { enqueueSnackbar } from 'notistack';

// interface ở đây
interface Product {
  id: number;
  products: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: any;
    name: string;
  };
  variant: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: any;
    size?: { name: string };
    color?: { name: string };
    price: number;
  };
  quantity: number;
}

interface CartItem {
  id?: number;
  tb_product_id: number;
  quantity: number;
  name?: string;
  price?: number;
  tb_size_id?: number;
  tb_color_id?: number;
  sku?: string;
  image?: string;
  tb_variant_id: number;
  variant: Variant
  size?: {
    name: string;
    tb_size_id: number;
  };
  color?: {
    name: string;
    tb_color_id: number;
  };
}

interface Quantity {
  id: number;
  quantity: number;
}

interface LocationState {
  selectedProducts: Product[];
  subtotal: number;
  cartId: number[];
  cartItem: CartItem;
  quantities: Quantity[];
}

interface AddressModalProps {
  addresses: Address[];
  selectedModalAddress: string;
  onSelectAddress: (address: Address) => void;
  openModal: boolean;
  onClose: () => void;
}

interface AddressFormModalProps {
  open: boolean;
  addressToUpdate: Address | null; // Địa chỉ đang được cập nhật, nếu có
  newAddress: {
    address: string;
    address_detail: string;
  };
  provinces: IProvince[];
  districts: IDistrict[];
  wards: IWard[];
  selectedAddress: string;
  onClose: () => void;
  onProvinceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDistrictChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onWardChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddAddress: () => void;
  onUpdateAddress: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ addresses, selectedModalAddress, onSelectAddress, openModal, onClose }) => {
  const { user, addAddress, updateAddress } = useUser();
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
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      alert('Đã xảy ra lỗi khi thêm địa chỉ');
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
      } catch (error) {
        console.error('Lỗi khi cập nhật địa chỉ:', error);
        alert('Đã xảy ra lỗi khi cập nhật địa chỉ');
      }
    }
  };

  return (
    <Dialog open={openModal} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
      <DialogContent>
        <List>
          {addresses
            .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
            .map((address) => (
              <ListItem
                key={address.id}
                onClick={() => onSelectAddress(address)}
                sx={{
                  border: selectedModalAddress === address.address ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  padding: '15px',
                  ":hover": { cursor: 'pointer' },
                  position: 'relative',
                }}
              >
                <div>
                  <Typography variant="body1" fontWeight="bold">
                    <LocationOnOutlinedIcon /> {address.address_detail}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {address.address}
                  </Typography>
                  {address.is_default == true && (
                    <Typography
                      sx={{
                        fontSize: 12,
                        display: "inline-block",
                        padding: "3px 6px",
                        border: "1px solid #1998E2",
                        color: "#1998E2",
                        borderRadius: "4px",
                        marginTop: 1
                      }}
                    >
                      Mặc định
                    </Typography>
                  )}
                </div>

                <Button
                  color="warning"
                  sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: "3px 6px",
                    border: "1px solid orange",
                    fontSize: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện click kích hoạt onClick của ListItem
                    handleClickOpen(address);
                  }}
                >
                  Cập nhật
                </Button>
              </ListItem>
            ))}
          {addresses.length === 0 && (
            <Typography variant="body2" color="textSecondary" align="center">
              Bạn chưa có địa chỉ nào. Hãy đăng nhập để có danh sách địa chỉ.
            </Typography>
          )}
        </List>
        {addresses.length > 0 && (
          <Button
            sx={{ border: "1px solid grey", padding: "8px", color: "black" }}
            onClick={() => handleClickOpen()}
          >+ Thêm địa chỉ mới
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Đóng
        </Button>
      </DialogActions>
      <AddressFormModal
        open={open}
        addressToUpdate={addressToUpdate}
        newAddress={newAddress}
        provinces={provinces}
        districts={districts}
        wards={wards}
        selectedAddress={selectedAddress}
        onClose={handleClose}
        onProvinceChange={handleProvinceChange}
        onDistrictChange={handleDistrictChange}
        onWardChange={handleWardChange}
        onInputChange={handleInputChange}
        onAddAddress={handleAddAddress}
        onUpdateAddress={handleUpdateAddress}
      />
    </Dialog>
  );
};

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  open,
  addressToUpdate,
  newAddress,
  provinces,
  districts,
  wards,
  selectedAddress,
  onClose,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  onInputChange,
  onAddAddress,
  onUpdateAddress, }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{addressToUpdate ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
      <DialogContent>
        <div className="form-row">
          {/* Tỉnh/Thành phố */}
          <div className="form-group col-md-4">
            <label htmlFor="province">Tỉnh/Thành phố</label>
            <select style={{ width: 150 }} id="province" className="form-control" onChange={onProvinceChange}>
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
              onChange={onDistrictChange}
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
              onChange={onWardChange}
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
            onChange={onInputChange}
          />
          <label htmlFor="addressInput" className="register-label">
            <i className="fas fa-map-marker-alt me-2"></i>
            Địa chỉ cụ thể
          </label>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Hủy
        </Button>
        <Button onClick={addressToUpdate ? onUpdateAddress : onAddAddress} color="primary">
          {addressToUpdate ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, addresses } = useUser();
  const [loadingUser, setLoadingUser] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { setLoading } = useLoading();
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const state = location.state as LocationState;
  const selectedProducts = useMemo(() => state?.selectedProducts || [], [state?.selectedProducts]);
  const subtotal = state?.subtotal ?? 0;
  const cartId = state?.cartId || [];
  const cartItem = state?.cartItem;
  const quantities = state?.quantities;
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<{ id: number; code: string; discount: number, max_price: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [newAddress, setNewAddress] = useState({
    address: '',
    address_detail: '',
  });
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const handleOpenAddressModal = () => setAddressModalOpen(true);
  const handleCloseAddressModal = () => setAddressModalOpen(false);

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address.address);
    setNewAddress((prev) => ({
      ...prev,
      address: address.address,
      address_detail: address.address_detail,
    }));
    handleCloseAddressModal();
  };

  useEffect(() => {
    if (user) {
      const userAddress = user?.data?.address?.[0]; // Giả sử địa chỉ đầu tiên trong danh sách của user là địa chỉ chính
      if (userAddress) {
        setSelectedAddress(userAddress.address || '');
        setNewAddress({
          address: userAddress.address || '',
          address_detail: userAddress.address_detail || '', // Cập nhật address_detail khi load trang
        });
      }
    }
  }, [user]);

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

  const handleProvinceChange = async (e: SelectChangeEvent<string>) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    const province = provinces.find((p) => p.code === provinceCode);
    if (province) {
      const districtsData = getDistrictsByProvinceCode(provinceCode);
      setDistricts(districtsData);
      setWards([]);
      updateSelectedAddress(province.name, "province");
    }
  };

  const handleDistrictChange = async (e: SelectChangeEvent<string>) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    const district = districts.find((d) => d.code === districtCode);
    if (district) {
      const wardsData = getWardsByDistrictCode(districtCode);
      setWards(wardsData);
      updateSelectedAddress(district.name, "district");
    }
  };

  const handleWardChange = (e: SelectChangeEvent<string>) => {
    const wardCode = e.target.value;
    setSelectedWard(wardCode);
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

    // Cập nhật vào state newAddress
    setNewAddress((prev) => ({
      ...prev,
      address: newSelectedAddress,
    }));
  };

  // Phương thức xử lý khi thay đổi lựa chọn phương thức thanh toán
  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  const calculateSubtotal = (cartItem: CartItem): number => {
    const price = cartItem.price ?? 0;
    return price * cartItem.quantity;
  };

  const calculateTotal = (subtotal: number, discountPercent: number, max_price: number = Number.MAX_VALUE): number => {
    const discount = subtotal * (discountPercent / 100); // Tính số tiền giảm theo phần trăm
    const finalDiscount = max_price ? Math.min(discount, max_price) : discount; // Áp dụng giới hạn giảm tối đa nếu có
    return subtotal - finalDiscount; // Tính tổng sau khi giảm giá
  };

  const subtotalCartItem = cartItem ? calculateSubtotal(cartItem) : 0;
  const totalCartItem = cartItem ? calculateTotal(subtotalCartItem, selectedVoucher?.discount || 0, selectedVoucher?.max_price) : 0;
  const totalWithDiscount = selectedProducts.length > 0 ? calculateTotal(subtotal, selectedVoucher?.discount || 0, selectedVoucher?.max_price) : 0;
  const handleApplyVoucher = (voucher: { id: number; code: string; discount: number; max_price: number }) => {
    setSelectedVoucher(voucher);
    setVoucherDialogOpen(false);
  };

  useEffect(() => {
    // console.log(user);

    const token = sessionStorage.getItem('token');
    if (!token) {
      setLoadingUser(false);
    } else if (user?.data) {
      setName(user.data.user.name || '');
      setEmail(user.data.user.email || '');
      setPhone(user.data.user.phone || '');
      setLoadingUser(false);
    } else {
      setLoadingUser(false);
    }
    // console.log(cartItem);
    // console.log(selectedProducts);
  }, [user]);

  const validateForm = () => {
    let isValid = true;
    if (!name.trim()) {
      setNameError('Họ tên không được để trống');
      isValid = false;
    } else {
      setNameError('');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      setEmailError('Email không được để trống');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      isValid = false;
    } else {
      setEmailError('');
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phone.trim()) {
      setPhoneError('Số điện thoại không được để trống');
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      isValid = false;
    } else {
      setPhoneError('');
    }
    return isValid;
  };

  // hàm checkout ở đây
  const handleCheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      let url = token
        ? 'http://localhost:8000/api/cart/check-out-cart'
        : 'http://localhost:8000/api/cart/check-out-guest'
      if (paymentMethod == 'vnpay' && token) {
        url = 'http://localhost:8000/api/payment-online'
      }
      if (paymentMethod == 'vnpay' && !token) {
        url = 'http://localhost:8000/api/payment-guest'
      }

      const totalAmount = selectedProducts.length > 0 ? totalWithDiscount : totalCartItem;
      const tbProductId = selectedProducts.length > 0 ? null : cartItem.tb_product_id;
      const tbVariantId = selectedProducts.length > 0 ? null : cartItem.tb_variant_id;
      const quantity = selectedProducts.length > 0 ? quantities : cartItem.quantity;
      const cart_items = selectedProducts.length > 0 ? cartId : null;

      const requestBody = {
        name,
        email,
        phone,
        address: selectedAddress,
        address_detail: newAddress.address_detail,
        quantities: quantity,
        tb_product_id: tbProductId,
        tb_variant_id: tbVariantId,
        total_amount: totalAmount,
        cart_items: cart_items,
        tb_discount_id: selectedVoucher?.id,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (paymentMethod === 'vnpay' && responseData.vnpay_url && !token) {
          // Chuyển hướng đến VNPay URL
          window.location.href = responseData.vnpay_url;
          const currentCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
          // Lọc bỏ các sản phẩm đã được chọn
          const updatedCart = currentCart.filter((item: any) =>
            !selectedProducts.some((selected: any) => selected.id === item.id)
          );
          localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
        // Nếu là khách vãng lai, xóa sản phẩm đã chọn khỏi giỏ hàng trong sessionStorage
        if (!token) {
          const currentCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
          // Lọc bỏ các sản phẩm đã được chọn
          const updatedCart = currentCart.filter((item: any) =>
            !selectedProducts.some((selected: any) => selected.id === item.id)
          );
          localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
        navigate("/payment-success"); // Chuyển hướng về trang thành công
      } else {
        enqueueSnackbar("Sản phẩm đã bị người khác mua mất vui lòng chọn sản phẩm khác", { variant: "error" });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // fetch giảm giá ở đây
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axiosInstance.get('/api/discount');
        const allDiscounts = response.data;
        const currentDate = new Date();

        // Lọc chỉ voucher còn hiệu lực
        const validDiscounts = allDiscounts.filter((discount: Discount) => {
          const startDate = new Date(discount.start_day);
          const endDate = new Date(discount.end_day);
          return currentDate >= startDate && currentDate <= endDate;
        });

        setDiscounts(validDiscounts);
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };
    fetchDiscounts();
  }, []);

  if (loadingUser) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="container py-5 mt-5">
      <div className="container" style={{ marginBottom: 50 }}>
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <button onClick={() => navigate("/")} className="stext-109 cl8 hov-cl1 trans-04">
            Trang chủ
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
          </button>
          <button onClick={() => navigate("/cart")} className="stext-109 cl8 hov-cl1 trans-04">
            Giỏ hàng
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
          </button>
          <span className="stext-109 cl4">Thanh toán</span>
        </div>
      </div>

      <h1 className="h3 mb-4">Thanh Toán</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Thông tin giao hàng</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input
                    name='name'
                    type="text"
                    className={`form-control ${nameError ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete='name'
                  />
                  {nameError && <div className="invalid-feedback">{nameError}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    name='email'
                    type="text"
                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete='email'
                  />
                  {emailError && <div className="invalid-feedback">{emailError}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    name='phone'
                    type="text"
                    className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete='phone'
                  />
                  {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                </div>

                <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                  {/* Tỉnh/Thành phố */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                      <InputLabel id="province-label">Tỉnh/Thành phố</InputLabel>
                      <Select
                        labelId="province-label"
                        id="province"
                        onChange={handleProvinceChange}
                        value={selectedProvince}
                      >
                        <MenuItem value="">
                          <em>Chọn tỉnh/thành</em>
                        </MenuItem>
                        {provinces.map((province) => (
                          <MenuItem key={province.code} value={province.code}>
                            {province.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Quận/Huyện */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth disabled={!districts.length}>
                      <InputLabel id="district-label">Quận/Huyện</InputLabel>
                      <Select
                        labelId="district-label"
                        id="district"
                        onChange={handleDistrictChange}
                        value={selectedDistrict}
                      >
                        <MenuItem value="">
                          <em>Chọn quận/huyện</em>
                        </MenuItem>
                        {districts.map((district) => (
                          <MenuItem key={district.code} value={district.code}>
                            {district.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Phường/Xã */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth disabled={!wards.length}>
                      <InputLabel id="ward-label">Phường/Xã</InputLabel>
                      <Select
                        labelId="ward-label"
                        id="ward"
                        onChange={handleWardChange}
                        value={selectedWard}
                      >
                        <MenuItem value="">
                          <em>Chọn phường/xã</em>
                        </MenuItem>
                        {wards.map((ward) => (
                          <MenuItem key={ward.code} value={ward.code}>
                            {ward.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

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

                <Button variant="outlined" onClick={handleOpenAddressModal} style={{ marginBottom: '20px' }}>
                  Chọn địa chỉ giao hàng
                </Button>
              </form>

              {/* Thêm giao diện phương thức thanh toán */}
              <div className="mt-4">
                <h5 className="card-title mb-4">Phương thức thanh toán</h5>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="payment-method"
                    name="payment-method"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                    <FormControlLabel value="vnpay" control={<Radio />} label="Thanh toán qua VNPay" />
                  </RadioGroup>
                </FormControl>
              </div>

            </div>
          </div>
        </div>

        <AddressModal
          addresses={addresses}
          selectedModalAddress={selectedAddress}
          onSelectAddress={handleSelectAddress}
          openModal={addressModalOpen}
          onClose={handleCloseAddressModal}
        />

        {/* Đơn hàng ở đây */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Đơn hàng của bạn</h5>
              <div className="mb-4">
                {/* Kiểm tra nếu selectedProducts có sản phẩm */}
                {selectedProducts.length > 0 && selectedProducts.map((item) => (
                  <div key={item.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <img src={`http://127.0.0.1:8000/storage/${item.variant.images[0].name_image}`} className="rounded" style={{ width: '64px', height: '64px', objectFit: 'cover' }} />
                    <div className="flex-grow-1">
                      <p className="mb-0" style={{ fontSize: 15 }}>{item.products.name}</p>
                      <div>
                        {item.variant?.size && item.variant.size !== null ? (
                          <small>{item.variant.size.name} | SL: {item.quantity}</small>
                        ) : null}
                        {item.variant?.color && item.variant.color !== null ? (
                          <small>{item.variant.color.name} | SL: {item.quantity}</small>
                        ) : null}
                        {!item.variant?.size && !item.variant?.color ? (
                          <small>SL: {item.quantity}</small>
                        ) : null}
                      </div>
                      <span>{item.variant?.price.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>
                ))}

                {/* Kiểm tra nếu cartItem có sản phẩm */}
                {cartItem && (
                  <div key={cartItem.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <img src={`http://127.0.0.1:8000/storage/${cartItem.variant.images[0].name_image}`} className="rounded" style={{ width: '64px', height: '64px', objectFit: 'cover' }} />
                    <div className="flex-grow-1">
                      <p className="mb-0" style={{ fontSize: 15 }}>{cartItem.name}</p>
                      <div>
                        {cartItem.size && cartItem.size !== null ? (
                          <small>{cartItem.size.name} | SL: {cartItem.quantity}</small>
                        ) : null}
                        {cartItem.color && cartItem.color !== null ? (
                          <small>{cartItem.color.name} | SL: {cartItem.quantity}</small>
                        ) : null}
                        {!cartItem.size && !cartItem.color ? (
                          <small>SL: {cartItem.quantity}</small>
                        ) : null}
                      </div>
                      <span>{cartItem.price?.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedProducts.length > 0 && (
                <div className="d-flex justify-content-between mb-3">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              {cartItem && (
                <div className="d-flex justify-content-between mb-3">
                  <span>Tạm tính</span>
                  <span>{subtotalCartItem.toLocaleString("vi-VN")}đ</span>
                </div>
              )}

              {selectedVoucher && selectedProducts.length > 0 && (
                <div className="d-flex justify-content-between mb-3">
                  <span>Giảm giá ({selectedVoucher.code})</span>
                  <span>
                    -{Math.min(
                      (subtotal * selectedVoucher.discount) / 100,
                      selectedVoucher.max_price ?? Number.MAX_VALUE
                    ).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
              {selectedVoucher && cartItem && (
                <div className="d-flex justify-content-between mb-3">
                  <span>Giảm giá ({selectedVoucher.code})</span>
                  <span>
                    -{Math.min(
                      (subtotalCartItem * selectedVoucher.discount) / 100,
                      selectedVoucher.max_price ?? Number.MAX_VALUE
                    ).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}

              {selectedProducts.length > 0 && (
                <div className="d-flex justify-content-between mb-3">
                  <span><strong>Tổng cộng</strong></span>
                  <span><strong>{Number(totalWithDiscount).toLocaleString("vi-VN")}đ</strong></span>
                </div>
              )}
              {cartItem && (
                <div className="d-flex justify-content-between mb-3">
                  <span><strong>Tổng cộng</strong></span>
                  <span><strong>{Number(totalCartItem).toLocaleString("vi-VN")}đ</strong></span>
                </div>
              )}

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => setVoucherDialogOpen(true)}
                sx={{ marginBottom: 2 }}
              >
                Chọn Voucher
              </Button>
              <button onClick={handleCheckOut} type="button" className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5" style={{ margin: "70px 0 30px 100px" }}>
                Đặt hàng
              </button>

              <Dialog open={voucherDialogOpen} onClose={() => setVoucherDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Chọn giảm giá</DialogTitle>
                <DialogContent>
                  {sessionStorage.getItem('token') ?
                    (
                      discounts.length > 0 ?
                        (
                          <List>
                            {discounts.map((discount) => (
                              <ListItem
                                key={discount.id}
                                divider
                                onClick={() => handleApplyVoucher({ id: discount.id, code: discount.discount_code, discount: discount.discount_value, max_price: discount.max_price })}
                                sx={{ display: 'flex', justifyContent: 'space-between' }}
                              >
                                <img src={logoVoucher} alt="" width={150} />
                                <div style={{ marginLeft: -150 }}>
                                  <Typography variant="subtitle1">{discount.discount_code}</Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    Giảm {discount.discount_value}% | Giảm tối đa:{(Number(discount.max_price)).toLocaleString("vi-VN")}đ
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    HSD: {discount.end_day}
                                  </Typography>
                                </div>
                                <Button variant="contained" size="small" sx={{ backgroundColor: "#717FE0" }}>
                                  Áp dụng
                                </Button>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body1" color="textSecondary" align="center" sx={{ fontSize: "25px" }}>
                            Hiện đang không có mã giảm giá nào
                          </Typography>
                        )
                    ) : (
                      <Typography variant="body1" color="textSecondary" align="center" sx={{ fontSize: "25px" }}>
                        Hãy đăng nhập để có voucher.
                      </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setVoucherDialogOpen(false)} color="primary">
                    Đóng
                  </Button>
                </DialogActions>
              </Dialog>

            </div>
          </div>
        </div>

      </div>
    </div >
  );
};

export default CheckoutPage;