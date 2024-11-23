import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "src/config/axiosInstance";
import { useCart } from "src/context/Cart";
import { Product, Variant } from "src/types/product";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState(""); // Nội dung bình luận mới
  const [rating, setRating] = useState<number | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  interface Comment {
    id: number;
    user: { name: string };
    created_at: string;
    content: string;
    rating?: number;
    replies?: Comment[];
  }

  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/api/products/${id}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchReplies = async (commentId: number) => {
    try {
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/api/comments/${commentId}/replies`
      );
      // Gắn trả lời vào comment cha
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: response.data }
            : comment
        )
      );
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "http://127.0.0.1:8000/api/comments",
        {
          tb_product_id: id,
          content: newComment,
          rating: rating || null,
          parent_id: parentId || null,
        }
      );

      // Thêm bình luận vào danh sách
      setComments((prev) => [...prev, response.data.data]);
      setNewComment(""); // Reset nội dung bình luận
      setRating(null); // Reset rating
      setParentId(null); // Reset parentId

      // Hiển thị thông báo thành công
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/product-list");
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

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
          setCurrentVariant(productData.variants[0]);
        } else if (productData.colors && productData.colors.length > 0) {
          setSelectedOption(String(productData.colors[0].id));
          updateVariant(null, String(productData.colors[0].id));
          setCurrentVariant(productData.variants[0]);
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
      tb_product_id: product?.id ?? 0, // Add tb_product_id to the cart item
      name: product?.name,
      sku: currentVariant.sku,
      price: currentVariant.price,
      quantity,
      products: null,
      size: product?.sizes
        ? product.variants.find((s) => String(s.tb_size_id) === selectedOption)
        : null,
      color: product?.colors
        ? product.variants.find((c) => String(c.tb_color_id) === selectedOption)
        : null,
      tb_variant_id: currentVariant.id, // Lưu biến thể được chọn
      variant: currentVariant, // Thêm thuộc tính variant vào đây
    };
    // Kiểm tra người dùng đã đăng nhập chưa (có thể dùng context hoặc localStorage để kiểm tra)
    addToCart(cartItem);
  };

  const handleBuyNow = () => {
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
      size:
        product?.sizes?.find((s) => String(s.id) === selectedOption) || null,
      color:
        product?.colors?.find((c) => String(c.id) === selectedOption) || null,
      tb_variant_id: currentVariant.id,
      variant: currentVariant,
    };

    navigate("/checkout", {
      state: {
        cartItem,
      },
    });

    console.log(cartItem);
  };

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
          <span className="stext-109 cl4">Sản phẩm</span>
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
                    <div
                      className="item-slick3"
                      data-thumb={`http://127.0.0.1:8000/storage/${product.image}`}
                    >
                      <div className="wrap-pic-w pos-relative">
                        <img
                          src={`http://127.0.0.1:8000/storage/${product.image}`}
                          alt="IMG-PRODUCT"
                          height={500}
                        />
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
                    SKU:{" "}
                    {currentVariant?.sku || product.variants[0].sku || "N/A"} |
                  </span>
                  <span style={{ fontSize: 13 }}>
                    SL:{" "}
                    {currentVariant?.quantity ||
                      product.variants[0].quantity ||
                      "N/A"}
                  </span>
                </div>
                <span className="mtext-106 cl2">
                  $
                  {currentVariant
                    ? currentVariant.price.toFixed(2)
                    : product.variants[0].price.toFixed(2)}
                </span>
                {/*  */}
                <div className="p-t-33">
                  {/* Conditionally Render Size Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex-w flex-r-m p-b-10">
                      <div className="size-203 flex-c-m respon6">Size</div>
                      <FormControl
                        variant="outlined"
                        sx={{ width: 300, marginRight: "50px" }}
                      >
                        <InputLabel>Choose an option</InputLabel>
                        <Select
                          value={selectedOption || ""}
                          onChange={handleChangeOption}
                          label="Size"
                          sx={{
                            borderRadius: "2px",
                            borderColor: "#e6e6e6",
                            backgroundColor: "#fff",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e6e6e6",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#b3b3b3",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                "& .MuiMenuItem-root": {
                                  "&.Mui-selected": {
                                    backgroundColor: "#6C7AE0",
                                    color: "#fff",
                                    "&:hover": {
                                      backgroundColor: "#6C7AE0",
                                    },
                                  },
                                },
                              },
                            },
                          }}
                        >
                          {product.sizes.map((size) => (
                            <MenuItem
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#6C7AE0",
                                  color: "#fff",
                                },
                              }}
                              key={size.id}
                              value={String(size.id)}
                            >
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
                      <div className="size-203 flex-c-m respon6">Color</div>
                      <FormControl
                        variant="outlined"
                        sx={{ width: 300, marginRight: "50px" }}
                      >
                        <InputLabel>Choose an option</InputLabel>
                        <Select
                          value={selectedOption || ""}
                          onChange={handleChangeOption}
                          label="Color"
                          sx={{
                            borderRadius: "2px",
                            borderColor: "#e6e6e6",
                            backgroundColor: "#fff",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e6e6e6",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#b3b3b3",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                "& .MuiMenuItem-root": {
                                  "&.Mui-selected": {
                                    backgroundColor: "#6C7AE0",
                                    color: "#fff",
                                    "&:hover": {
                                      backgroundColor: "#6C7AE0",
                                    },
                                  },
                                },
                              },
                            },
                          }}
                        >
                          {product.colors.map((color) => (
                            <MenuItem
                              sx={{
                                "&:hover": {
                                  backgroundColor: "#6C7AE0",
                                  color: "#fff",
                                },
                              }}
                              key={color.id}
                              value={String(color.id)}
                            >
                              {color.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  )}

                  <div className="flex-w flex-r-m p-b-10">
                    <div className="size-204 flex-w flex-m respon6-next">
                      <div
                        className="wrap-num-product flex-w m-r-20 m-tb-10"
                        style={{ marginLeft: "22px" }}
                      >
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
                      <div style={{ display: "flex", marginTop: "10px" }}>
                        <button
                          onClick={handleAddToCart}
                          className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                          style={{ width: "250px", margin: "0 20px 0 -100px" }}
                        >
                          Add to cart
                        </button>
                        <button
                          onClick={handleBuyNow}
                          className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                        >
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="flex-w flex-m p-l-100 p-t-40 respon7">
                  <div className="flex-m bor9 p-r-10 m-r-11">
                    <a
                      href="#"
                      className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 js-addwish-detail tooltip100"
                      data-tooltip="Add to Wishlist"
                    >
                      <i className="zmdi zmdi-favorite" />
                    </a>
                  </div>
                  <a
                    href="#"
                    className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                    data-tooltip="Facebook"
                  >
                    <i className="fa fa-facebook" />
                  </a>
                  <a
                    href="#"
                    className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                    data-tooltip="Twitter"
                  >
                    <i className="fa fa-twitter" />
                  </a>
                  <a
                    href="#"
                    className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                    data-tooltip="Google Plus"
                  >
                    <i className="fa fa-google-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        //
        {/* review và mô tả */}
        <Box className="comments-section" sx={{ padding: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="product tabs"
          >
            <Tab label="Description" />
            <Tab label={`Reviews (${comments.length})`} />
          </Tabs>

          <div className="tab-content">
            {selectedTab === 0 && (
              <div id="description">
                <Typography variant="body1" color="textSecondary">
                  {product.description}
                </Typography>
              </div>
            )}

            {selectedTab === 1 && (
              <div id="reviews">
                <Box className="comments-list" sx={{ marginTop: 2 }}>
                  {comments.map((comment) => (
                    <Card key={comment.id} sx={{ marginBottom: 2 }}>
                      <CardContent>
                        <Typography variant="body1" component="strong">
                          {comment.user.name} -{" "}
                          {new Date(comment.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                          {comment.content}
                        </Typography>
                        {comment.rating && (
                          <Typography variant="body2" sx={{ marginTop: 1 }}>
                            Rating: {comment.rating}⭐
                          </Typography>
                        )}
                        <Box sx={{ marginTop: 1 }}>
                          <Button
                            onClick={() => fetchReplies(comment.id)}
                            variant="outlined"
                            size="small"
                          >
                            Show Replies
                          </Button>
                          <Button
                            onClick={() => setParentId(comment.id)}
                            variant="outlined"
                            size="small"
                            sx={{ marginLeft: 1 }}
                          >
                            Reply
                          </Button>
                        </Box>

                        {comment.replies?.map((reply) => (
                          <Box key={reply.id} sx={{ marginTop: 2 }}>
                            <Typography variant="body2" component="strong">
                              {reply.user?.name} -{" "}
                              {new Date(reply.created_at).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                              {reply.content}
                            </Typography>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
                  <div>
                    <TextField
                      label="Your Rating"
                      type="number"
                      value={rating ?? ""}
                      onChange={(e) => setRating(parseInt(e.target.value, 10))}
                      inputProps={{ min: 1, max: 5 }}
                      fullWidth
                      variant="outlined"
                      sx={{ marginBottom: 2 }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Your Review"
                      multiline
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ marginBottom: 2 }}
                    />
                  </div>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Snackbar for success message */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Comment submitted successfully!
            </Alert>
          </Snackbar>
        </Box>
      </section>
      <section className="product-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Sản phẩm liên quan</h2>
            <div className="title-underline"></div>
          </div>

          <div className="slider">
            <div className="slide-track">
              {/* Original products */}
              {products.data.map((product: Product) => (
                <div key={product.id} className="slide">
                  <div className="product-inner">
                    <div className="product-image-wrapper">
                      <img
                        src={`http://127.0.0.1:8000/storage/${product.image}`}
                        className="product-image"
                      />
                    </div>
                    <div className="product-info">
                      <Link
                        to={`/product/${product.id}`}
                        className="product-link"
                      >
                        <h5 className="product-title">{product.name}</h5>
                      </Link>
                      <p className="product-price">
                        ${product.variants[0]?.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Cloned products for seamless loop */}
              {products.data.map((product: Product) => (
                <div key={`clone-${product.id}`} className="slide">
                  <div className="product-inner">
                    {product.variants[0]?.images[0] && (
                      <div className="product-image-wrapper">
                        <img
                          src={`http://127.0.0.1:8000/storage/${product.image}`}
                          className="product-image"
                        />
                      </div>
                    )}
                    <div className="product-info">
                      <Link
                        to={`/product/${product.id}`}
                        className="product-link"
                      >
                        <h5 className="product-title">{product.name}</h5>
                      </Link>
                      <p className="product-price">
                        ${product.variants[0]?.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
