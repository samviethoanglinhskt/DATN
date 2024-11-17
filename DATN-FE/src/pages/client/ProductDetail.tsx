import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "src/config/axiosInstance";
import { useCart } from "src/context/Cart";
import { Product, Variant } from "src/types/product";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>(); // lấy productId từ URL
  const { addToCart } = useCart();  // Giả sử bạn có hàm addToCart trong context
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);  // Số lượng sản phẩm trong giỏ

  // Gọi API để lấy thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/product/${id}`);
        const productData = response.data;
        setProduct(productData);

        // Cài đặt giá trị mặc định cho Size hoặc Color nếu có
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedOption(String(productData.sizes[0].id));
          updateVariant(String(productData.sizes[0].id), null);
          setCurrentVariant(productData.variants[0])
        } else if (productData.colors && productData.colors.length > 0) {
          setSelectedOption(String(productData.colors[0].id));
          updateVariant(null, String(productData.colors[0].id));
          setCurrentVariant(productData.variants[0])

        } else {
          // Nếu không có size và color, hiển thị mặc định
          setCurrentVariant(productData?.variants[0]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const updateVariant = (sizeId: string | null, colorId: string | null) => {
    if (!product) return;

    const variant = product.variants.find(
      (v) =>
        (sizeId && String(v.tb_size_id) === sizeId) ||
        (colorId && String(v.tb_color_id) === colorId)
    );
    setCurrentVariant(variant || null);
  };

  const handleChangeOption = (event: SelectChangeEvent) => {
    const newOptionId = event.target.value as string;
    setSelectedOption(newOptionId);

    if (product?.sizes && product.sizes.length > 0) {
      updateVariant(newOptionId, null);
    } else if (product?.colors && product.colors.length > 0) {
      updateVariant(null, newOptionId);
    }
    console.log("newOptionId:", newOptionId);
  };

  const handleQuantityChange = (operation: "increase" | "decrease") => {
    if (currentVariant) {
      const newQuantity =
        operation === "increase"
          ? quantity + 1
          : operation === "decrease" && quantity > 1
            ? quantity - 1
            : quantity;
      // Kiểm tra số lượng sản phẩm có lớn hơn số lượng còn lại trong variant không
      if (newQuantity <= currentVariant.quantity) {
        setQuantity(newQuantity);
      }
    }
  };

  const handleAddToCart = () => {
    if (!currentVariant) {
      alert("Vui lòng chọn biến thể sản phẩm trước khi thêm vào giỏ hàng.");
      return;
    }

    const cartItem = {
      tb_product_id: product?.id ?? 0,  // Add tb_product_id to the cart item
      name: product?.name,
      sku: currentVariant.sku,
      price: currentVariant.price,
      quantity,
      size: product?.sizes ? product.variants.find(s => String(s.tb_size_id) === selectedOption) : null,
      color: product?.colors ? product.variants.find(c => String(c.tb_color_id) === selectedOption) : null,
      tb_variant_id: currentVariant.id,  // Lưu biến thể được chọn
      variant: currentVariant,  // Thêm thuộc tính variant vào đây
    };
    // Kiểm tra người dùng đã đăng nhập chưa (có thể dùng context hoặc localStorage để kiểm tra)
    addToCart(cartItem);
  }

  const handleAddToBuy = () => {
    if (!currentVariant) {
      alert("Vui lòng chọn biến thể sản phẩm trước khi thêm vào giỏ hàng.");
      return;
    }
  }

  if (!product) {
    return <div>Loading...</div>; // Hiển thị Loading nếu chưa có dữ liệu
  }

  return (
    <div>
      {/* breadcrumb */}
      <div className="container mt-5">
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a href="/" className="stext-109 cl8 hov-cl1 trans-04">
            Home
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true" />
          </a>
          <span className="stext-109 cl4">
            Sản phẩm
          </span>
        </div>
      </div>

      {/* Product Detail */}
      <section className="sec-product-detail bg0 p-t-65 p-b-60">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-7 p-b-30">
              <div className="p-l-25 p-r-30 p-lr-0-lg">
                <div className="wrap-slick3 flex-sb flex-w">
                  <div className="wrap-slick3-dots" />
                  <div className="wrap-slick3-arrows flex-sb-m flex-w" />
                  <div className="slick3 gallery-lb">
                    <div className="item-slick3" data-thumb="https://picsum.photos/200/300">
                      <div className="wrap-pic-w pos-relative">
                        <img src="https://picsum.photos/200/300" alt="IMG-PRODUCT" height={500} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-5 p-b-30">
              <div className="p-r-50 p-t-5 p-lr-0-lg">
                <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                  {product.name}
                </h4>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 13 }}>
                    Thương hiệu: {product.brand.name} |
                  </span>
                  <span style={{ fontSize: 13, margin: "0 5px" }}>
                    SKU: {currentVariant?.sku || product.variants[0].sku || "N/A"} |
                  </span>
                  <span style={{ fontSize: 13 }}>
                    SL: {currentVariant?.quantity || product.variants[0].quantity || "N/A"}
                  </span>
                </div>
                <span className="mtext-106 cl2">
                  ${currentVariant ? currentVariant.price.toFixed(2) : product.variants[0].price.toFixed(2)}
                </span>
                {/*  */}
                <div className="p-t-33">

                  {/* Conditionally Render Size Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex-w flex-r-m p-b-10">
                      <div className="size-203 flex-c-m respon6">
                        Size
                      </div>
                      <FormControl variant="outlined" sx={{ width: 300, marginRight: "50px" }}>
                        <InputLabel>Choose an option</InputLabel>
                        <Select
                          value={selectedOption || ""}
                          onChange={handleChangeOption}
                          label="Size"
                          sx={{
                            borderRadius: '2px',
                            borderColor: '#e6e6e6',
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e6e6e6',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#b3b3b3',
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                '& .MuiMenuItem-root': {
                                  '&.Mui-selected': {
                                    backgroundColor: '#6C7AE0',
                                    color: '#fff',
                                    '&:hover': {
                                      backgroundColor: '#6C7AE0',
                                    },
                                  },
                                },
                              },
                            },
                          }}
                        >
                          {product.sizes.map((size) => (
                            <MenuItem sx={{ '&:hover': { backgroundColor: '#6C7AE0', color: '#fff', } }} key={size.id} value={String(size.id)}>
                              {size.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}

                  {/* Conditionally Render Size Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex-w flex-r-m p-b-10">
                      <div className="size-203 flex-c-m respon6">
                        Color
                      </div>
                      <FormControl variant="outlined" sx={{ width: 300, marginRight: "50px" }}>
                        <InputLabel>Choose an option</InputLabel>
                        <Select
                          value={selectedOption || ""}
                          onChange={handleChangeOption}
                          label="Color"
                          sx={{
                            borderRadius: '2px',
                            borderColor: '#e6e6e6',
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e6e6e6',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#b3b3b3',
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                '& .MuiMenuItem-root': {
                                  '&.Mui-selected': {
                                    backgroundColor: '#6C7AE0',
                                    color: '#fff',
                                    '&:hover': {
                                      backgroundColor: '#6C7AE0',
                                    },
                                  },
                                },
                              },
                            },
                          }}
                        >
                          {product.colors.map((color) => (
                            <MenuItem sx={{ '&:hover': { backgroundColor: '#6C7AE0', color: '#fff', } }} key={color.id} value={String(color.id)}>
                              {color.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}

                  <div className="flex-w flex-r-m p-b-10">
                    <div className="size-204 flex-w flex-m respon6-next">
                      <div className="wrap-num-product flex-w m-r-20 m-tb-10" style={{ marginLeft: "22px" }}>
                        <button onClick={() => handleQuantityChange("decrease")} className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m">
                          <i className="fs-16 zmdi zmdi-minus" />
                        </button>
                        <input className="mtext-104 cl3 txt-center num-product" type="text" name="num-product" readOnly value={quantity} />
                        <button onClick={() => handleQuantityChange("increase")} className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m">
                          <i className="fs-16 zmdi zmdi-plus" />
                        </button>
                      </div>
                      <div style={{ display: 'flex', marginTop: "10px" }}>
                        <button onClick={handleAddToCart} className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail" style={{ width: "250px", margin: "0 20px 0 -100px" }}>
                          Add to cart
                        </button>
                        <button onClick={handleAddToBuy} className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail">
                          Mua ngay
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="flex-w flex-m p-l-100 p-t-40 respon7">
                  <div className="flex-m bor9 p-r-10 m-r-11">
                    <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 js-addwish-detail tooltip100" data-tooltip="Add to Wishlist">
                      <i className="zmdi zmdi-favorite" />
                    </a>
                  </div>
                  <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Facebook">
                    <i className="fa fa-facebook" />
                  </a>
                  <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Twitter">
                    <i className="fa fa-twitter" />
                  </a>
                  <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Google Plus">
                    <i className="fa fa-google-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetail