import { Box, FormControl, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "src/config/axiosInstance";
import { useCart } from "src/context/Cart";
import { Product, Variant } from "src/types/product";
import iconUser from "src/assets/images/icons/user.png"
import { CartItem } from "src/types/cart";
import { useFavorites } from "src/context/FavoriteProduct";
import { useLoading } from "src/context/LoadingContext";
import LoadingOverlay from "src/components/Loading/Loading";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { setLoading } = useLoading();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const reviewsPerPage = 3; // Số đánh giá mỗi trang
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const navigate = useNavigate();

  // Tính toán trung bình số sao
  const averageRating = reviews
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  // Gọi API để lấy thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/product/${id}`);
        const productData = response.data;
        setProduct(productData);
        const defaultVariant = productData?.variants[0];

        // Cài đặt giá trị mặc định cho Size hoặc Color nếu có
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedOption(String(productData.sizes[0].id));
          updateVariant(String(productData.sizes[0].id), null);
          setCurrentVariant(defaultVariant);
          setCurrentImage(defaultVariant?.images?.[0]?.name_image || "");
        } else if (productData.colors && productData.colors.length > 0) {
          setSelectedOption(String(productData.colors[0].id));
          updateVariant(null, String(productData.colors[0].id));
          setCurrentVariant(defaultVariant);
          setCurrentImage(defaultVariant?.images?.[0]?.name_image || "");
        } else {
          // Nếu không có size và color, hiển thị mặc định
          setCurrentVariant(defaultVariant);
          setCurrentImage(defaultVariant?.images?.[0]?.name_image || "");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async (page: number) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/reviews/product/${id}`, {
          params: {
            page,
            per_page: reviewsPerPage,
          },
        });
        setReviews(response.data.data); // Lưu danh sách đánh giá
        setCurrentPage(response.data.current_page); // Cập nhật trang hiện tại
        setTotalPages(response.data.last_page); // Cập nhật tổng số trang
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
      fetchReviews(currentPage);
    }
  }, [id, currentPage, setLoading]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // useEffect(() => {
  //   console.log(reviews);
  // })

  const updateVariant = (sizeId: string | null, colorId: string | null) => {
    if (!product) return;

    const variant = product.variants.find(
      (v) =>
        (sizeId && String(v.tb_size_id) === sizeId) ||
        (colorId && String(v.tb_color_id) === colorId)
    );
    setCurrentVariant(variant || null);
    // Cập nhật ảnh đầu tiên của biến thể
    setCurrentImage(variant?.images?.[0]?.name_image || "");
    setQuantity(1);
  };

  const handleChangeOption = (event: SelectChangeEvent) => {
    const newOptionId = event.target.value as string;
    setSelectedOption(newOptionId);

    if (product?.sizes && product.sizes.length > 0) {
      updateVariant(newOptionId, null);
    } else if (product?.colors && product.colors.length > 0) {
      updateVariant(null, newOptionId);
    }
    // console.log("newOptionId:", newOptionId);
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

  const [currentImage, setCurrentImage] = useState(
    currentVariant?.images?.[0]?.name_image || ""
  );

  const handleImageClick = (image: SetStateAction<string>) => {
    setCurrentImage(image);
  };

  const handleAddToCart = () => {
    if (!currentVariant) {
      alert("Vui lòng chọn biến thể sản phẩm trước khi thêm vào giỏ hàng.");
      return;
    }

    // Lấy danh sách giỏ hàng hiện tại (ví dụ lưu trong localStorage hoặc context)
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    // Tính tổng số lượng sản phẩm của biến thể hiện tại đã có trong giỏ hàng
    const existingQuantity = guestCart
      .filter((item: CartItem) => item.tb_variant_id === currentVariant.id)
      .reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

    // Tính tổng số lượng sản phẩm muốn thêm
    const totalQuantity = existingQuantity + quantity;
    // Kiểm tra số lượng không vượt quá số lượng cho phép
    if (totalQuantity > currentVariant.quantity) {
      alert(`Số lượng thêm vượt quá giới hạn trong kho. Số lượng tối đa có thể thêm là ${currentVariant.quantity - existingQuantity}.`);
      return;
    }

    const cartItem = {
      tb_product_id: product?.id ?? 0,  // Add tb_product_id to the cart item
      name: product?.name,
      sku: currentVariant.sku,
      price: currentVariant.price,
      quantity,
      products: {
        id: product?.id,
        image: product?.image,
        name: product?.name
      },
      size: product?.sizes ? product.variants.find(s => String(s.tb_size_id) === selectedOption) : null,
      color: product?.colors ? product.variants.find(c => String(c.tb_color_id) === selectedOption) : null,
      tb_variant_id: currentVariant.id,  // Lưu biến thể được chọn
      variant: {
        ...currentVariant,
        size: currentVariant.tb_size_id ? product?.sizes.find(item => item.id === currentVariant.tb_size_id) : null,
        color: currentVariant.tb_color_id ? product?.colors.find(item => item.id === currentVariant.tb_color_id) : null
      },  // Thêm thuộc tính variant vào đây
    };
    // Thêm vào giỏ hàng và cập nhật localStorage
    addToCart(cartItem);
  }

  const handleBuyNow = async () => {
    if (!currentVariant) {
      alert("Vui lòng chọn biến thể sản phẩm trước khi thêm vào giỏ hàng.");
      return;
    }

    const cartItem = {
      tb_product_id: product?.id ?? 0,
      name: product?.name,
      sku: currentVariant.sku,
      price: currentVariant.price,
      quantity,
      image: product?.image,
      size: product?.sizes?.find((s) => String(s.id) === selectedOption) || null,
      color: product?.colors?.find((c) => String(c.id) === selectedOption) || null,
      tb_variant_id: currentVariant.id,
      variant: currentVariant,
    };

    try {
      // Gửi request kiểm tra tồn kho
      const response = await axiosInstance.post("/api/cart/check-investory", {
        cart_items: [{ tb_variant_id: currentVariant.id, quantity }],
      });

      if (response.data.success) {
        // Nếu tồn kho đủ, điều hướng đến trang thanh toán
        navigate("/checkout", {
          state: {
            cartItem,
          },
        });
      }
    } catch {
      alert("Số lượng sản phẩm trong kho không đủ. Đừng lo chúng tôi sẽ giúp bạn đồng bộ lại số lượng");
      window.location.reload();
    }
  }

  const isFavorite = (productId: number) => {
    return favorites.some((fav) => fav.tb_product_id === productId);
  };

  const getFavoriteId = (productId: number) => {
    const favorite = favorites.find((fav) => fav.tb_product_id === productId);
    return favorite?.id; // Lấy id của mục yêu thích
  };

  if (!product) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      {/* breadcrumb */}
      <div className="container" style={{ marginTop: 80 }}>
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a href="/" className="stext-109 cl8 hov-cl1 trans-04">
            Trang chủ
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
                <Grid container spacing={2}>
                  {/* Slideshow ảnh nhỏ */}
                  <Grid item xs={2}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        maxWidth: "100px",
                        overflowY: "auto",
                        overflowX: "hidden", // Ẩn cuộn ngang
                        '&::-webkit-scrollbar': {
                          width: '5px', // Độ rộng của scrollbar
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: '#f0f0f0', // Màu nền track scrollbar
                          borderRadius: '8px', // Bo góc track
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#1976d2', // Màu của thumb scrollbar
                          borderRadius: '8px', // Bo góc thumb
                          border: '2px solid #f0f0f0', // Viền xung quanh thumb
                        },
                      }}
                    >
                      <ImageList cols={1} gap={8}>
                        {product?.variants.map((variant) =>
                          variant.images?.map((image, index) => (
                            <ImageListItem key={index} onClick={() => handleImageClick(image.name_image)}>
                              <img
                                src={`http://127.0.0.1:8000/storage/${image.name_image}`}
                                alt={`Variant ${index}`}
                                style={{
                                  cursor: "pointer",
                                  borderRadius: "8px",
                                  border: currentImage === image.name_image ? "2px solid #1976d2" : "none",
                                }}
                              />
                            </ImageListItem>
                          ))
                        )}
                      </ImageList>
                    </Box>
                  </Grid>

                  {/* Ảnh sản phẩm lớn */}
                  <Grid item xs={10}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f7f7f7",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        overflow: "hidden",
                        padding: "10px",
                        maxWidth: 550,
                      }}
                    >
                      {currentImage ?
                        (<img
                          src={`http://127.0.0.1:8000/storage/${currentImage}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "4px",
                          }}
                        />) : "Hãy chọn ảnh"}

                    </Box>
                  </Grid>
                </Grid>
              </div>
            </div>

            <div className="col-md-6 col-lg-5 p-b-30">
              <div className="p-r-50 p-t-5 p-lr-0-lg">
                <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                  {product.name}
                </h4>
                <div>
                  <span>
                    {averageRating > 0
                      ? Array.from({ length: 5 }).map((_, index) => (
                        <i
                          key={index}
                          className={`zmdi ${index < averageRating ? "zmdi-star" : "zmdi-star-outline"
                            }`}
                          style={{ color: index < averageRating ? "#ffcc00" : "#ccc", }}
                        />
                      ))
                      : "Chưa có đánh giá"}
                  </span>
                  <hr />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 13 }}>
                    Thương hiệu: {product.brand.name} |
                  </span>
                  <span style={{ fontSize: 13, margin: "0 5px" }}>
                    SKU: {currentVariant?.sku || product.variants[0].sku || "N/A"} |
                  </span>
                  {currentVariant?.quantity === 0 ? (<span style={{ fontSize: 13 }}>Hết hàng</span>)
                    : (
                      <span style={{ fontSize: 13 }}>
                        SL: {currentVariant?.quantity || product.variants[0].quantity || "N/A"}
                      </span>
                    )}
                </div>
                <span className="mtext-106 cl2">
                  {currentVariant ? currentVariant.price.toLocaleString("vi-VN") : product.variants[0].price.toLocaleString("vi-VN")}đ
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
                      {currentVariant?.quantity === 0 ? (
                        <h5 style={{ color: "red", fontWeight: "bold" }}>
                          Sản phẩm đã hết hàng
                        </h5>
                      ) :
                        (<div className="wrap-num-product flex-w m-r-20 m-tb-10" style={{ marginLeft: "22px" }}>
                          <button
                            onClick={() => handleQuantityChange("decrease")}
                            className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                          >
                            <i className="fs-16 zmdi zmdi-minus" />
                          </button>
                          <input
                            className="mtext-104 cl3 txt-center num-product"
                            type="text"
                            name="num-product"
                            readOnly
                            value={quantity}
                          />
                          <button
                            onClick={() => handleQuantityChange("increase")}
                            className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                          >
                            <i className="fs-16 zmdi zmdi-plus" />
                          </button>
                        </div>
                        )}
                      <div style={{ display: 'flex', marginTop: "10px" }}>
                        <button
                          onClick={handleAddToCart}
                          className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                          style={{ width: "250px", margin: "0 20px 0 -100px" }}
                          hidden={currentVariant?.quantity === 0}
                        >
                          Thêm vào giỏ hàng
                        </button>
                        <button
                          onClick={handleBuyNow}
                          className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                          hidden={currentVariant?.quantity === 0}
                        >
                          Mua ngay
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="flex-w flex-m p-l-100 p-t-40 respon7">
                  <button
                    className={`btn wishlist-btn m-2 ${isFavorite(product.id) ? "text-danger" : ""
                      }`}
                    onClick={() => {
                      if (isFavorite(product.id)) {
                        const favoriteId = getFavoriteId(product.id);
                        if (favoriteId) removeFavorite(favoriteId); // Truyền ID của mục yêu thích
                      } else {
                        addFavorite(product.id);
                      }
                    }}
                  >
                    <i
                      className={
                        isFavorite(product.id)
                          ? "zmdi zmdi-favorite"
                          : "zmdi zmdi-favorite-outline"
                      }
                    ></i>
                  </button>
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

          {/* review và mô tả */}
          <div className="bor10 m-t-50 p-t-43 p-b-40">
            <div className="tab01">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item p-b-10">
                  <a className="nav-link active" data-toggle="tab" href="#description" role="tab">Mô tả</a>
                </li>
                <li className="nav-item p-b-10">
                  <a className="nav-link" data-toggle="tab" href="#reviews" role="tab">Đánh giá</a>
                </li>
              </ul>
              <div className="tab-content p-t-43">
                <div className="tab-pane fade show active" id="description" role="tabpanel">
                  <div className="how-pos2 p-lr-15-md">
                    <p className="stext-102 cl6">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="tab-pane fade" id="reviews" role="tabpanel">
                  <div className="row">
                    <div className="col-sm-10 col-md-8 col-lg-6 m-lr-auto">
                      <div className="p-b-30 m-lr-15-sm">
                        {reviews ? (
                          reviews.map((review) => (
                            <div className="flex-w flex-t p-b-68" key={review.id}>
                              <div className="wrap-pic-s size-109 bor0 of-hidden m-r-18 m-t-6">
                                <img src={iconUser} alt="User Icon" style={{ width: 50, height: 50 }} />
                              </div>
                              <div className="size-207">
                                <div className="flex-w flex-sb-m p-b-17">
                                  <span className="mtext-107 cl2 p-r-20">
                                    {review.user.name}
                                  </span>
                                  <span className="fs-18 cl11">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                      <i
                                        key={index}
                                        className={`zmdi ${index < review.rating ? "zmdi-star" : "zmdi-star-outline"
                                          }`}
                                      />
                                    ))}
                                  </span>
                                </div>
                                <p className="stext-102 cl6">{review.comment}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="stext-102 cl6">Không có đánh giá nào cho sản phẩm này.</p>
                        )}
                      </div>
                      <div className="flex-w flex-c-m m-t-20">
                        <button
                          className="flex-c-m stext-101 cl2 size-103 bg8 bor13 hov-btn3 trans-04 m-all-4"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          Trước
                        </button>
                        <span className="stext-102 cl6 m-all-4">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          className="flex-c-m stext-101 cl2 size-103 bg8 bor13 hov-btn3 trans-04 m-all-4"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section >

    </div >
  )
}

export default ProductDetail