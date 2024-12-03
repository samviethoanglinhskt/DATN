import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Steps,
  Card,
  message,
  Space,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload";
import axiosInstance from "src/config/axiosInstance";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

interface IVariant {
  tb_size_id: number | null;
  tb_color_id: number | null;
  sku: string;
  price: number;
  quantity: number;
  status: string;
  images?: any[];
}
const ProductSteps: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [productForm] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [variants, setVariants] = useState<IVariant[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<UploadFile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, brandsRes, sizesRes, colorsRes] = await Promise.all(
        [
          axiosInstance.get("/api/category"),
          axiosInstance.get("/api/brand"),
          axiosInstance.get("/api/size"),
          axiosInstance.get("/api/color"),
        ]
      );

      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
      setSizes(sizesRes.data);
      setColors(colorsRes.data);
    } catch (error) {
      message.error("Failed to fetch initial data");
    }
  };
  const validateVariant = (values: any) => {
    // Check if variant with same size/color combination exists
    const existingVariant = variants.find(
      (variant) =>
        variant.tb_size_id === values.tb_size_id &&
        variant.tb_color_id === values.tb_color_id
    );

    if (existingVariant) {
      throw new Error("A variant with this combination already exists");
    }

    return values;
  };

  const handleVariantAdd = async () => {
    try {
      const values = await variantForm.validateFields();
      const validatedValues = validateVariant(values);

      const newVariant: IVariant = {
        ...validatedValues,
        tb_size_id: validatedValues.tb_size_id || null,
        tb_color_id: validatedValues.tb_color_id || null,
        images: values.images?.fileList?.map((file: any) => ({
          originFileObj: file.originFileObj,
          url: URL.createObjectURL(file.originFileObj),
        })),
      };

      setVariants([...variants, newVariant]);
      variantForm.resetFields();
      message.success("Variant added successfully");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Please fill all required fields");
      }
    }
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
    message.success("Variant removed");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const productValues = productForm.getFieldsValue(true);

      // Kiểm tra các trường bắt buộc
      if (
        !productValues.name ||
        !productValues.tb_category_id ||
        !productValues.tb_brand_id ||
        !productValues.status ||
        !productImage
      ) {
        throw new Error("Please fill all required product information");
      }

      const formData = new FormData();

      // Thêm thông tin sản phẩm
      formData.append("tb_category_id", productValues.tb_category_id);
      formData.append("tb_brand_id", productValues.tb_brand_id);
      formData.append("name", productValues.name);
      formData.append("status", productValues.status);
      formData.append("image", productImage[0]?.originFileObj);

      // Thêm các biến thể (variant) với việc kiểm tra null
      variants.forEach((variant: IVariant, index) => {
        if (variant.tb_size_id) {
          formData.append(
            `variants[${index}][tb_size_id]`,
            variant.tb_size_id.toString()
          );
        }
        if (variant.tb_color_id) {
          formData.append(
            `variants[${index}][tb_color_id]`,
            variant.tb_color_id.toString()
          );
        }
        formData.append(`variants[${index}][sku]`, variant.sku);
        formData.append(`variants[${index}][price]`, variant.price.toString());
        formData.append(
          `variants[${index}][quantity]`,
          variant.quantity.toString()
        );
        formData.append(`variants[${index}][status]`, variant.status);

        // Thêm hình ảnh cho biến thể
        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((image: any, imgIndex: number) => {
            if (image.originFileObj) {
              formData.append(
                `variants[${index}][images][${imgIndex}][name_image]`,
                image.originFileObj
              );
            }
          });
        }
      });

      // Gửi yêu cầu POST để thêm sản phẩm mới
      const response = await axiosInstance.post("/api/product", formData);

      // In ra toàn bộ response để kiểm tra
      console.log("Response từ API:", response);

      // Kiểm tra nếu API trả về message thành công
      if (
        response.data &&
        response.data.message === "Tạo sản phẩm thành công"
      ) {
        // Reset tất cả các form và state
        productForm.resetFields(); // Đảm bảo reset form chính xác
        variantForm.resetFields(); // Reset biến thể form
        setVariants([]); // Reset variants
        setProductImage([]); // Reset hình ảnh sản phẩm
        setCurrentStep(0); // Đặt lại bước hiện tại

        // Hiển thị thông báo thành công
        message.success({
          content: "Thêm sản phẩm thành công!",
          className: "custom-message-success", // Kiểm tra lại class này
          duration: 3, // Hiển thị trong 3 giây
          // onClick: () => navigate("/products"),
        });

        // Delay chuyển hướng sau khi thông báo
        // setTimeout(() => {
        //   navigate("/products");
        // }, 3000); // Chuyển hướng sau 3 giây
      } else {
        // Nếu message khác "Tạo sản phẩm thành công", báo lỗi
        console.error("API Response không thành công:", response.data);
        message.error("Thêm sản phẩm thất bại");
      }
    } catch (error) {
      console.error(error);
      // In lỗi trong catch để kiểm tra nguyên nhân
      message.error({
        content:
          error instanceof Error ? error.message : "Thêm sản phẩm thất bại",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Thông tin sản phẩm",
      content: (
        <Form
          form={productForm}
          layout="vertical"
          initialValues={{ status: "còn hàng" }}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tb_category_id"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Select>
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tb_brand_id"
            label="Thương hiệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu" },
            ]}
          >
            <Select>
              {brands.map((brand) => (
                <Select.Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="còn hàng">Còn hàng</Select.Option>
              <Select.Option value="hết hàng">Hết hàng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Ảnh sản phẩm"
            required
            validateTrigger={["onChange", "onBlur"]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ fileList }) => setProductImage(fileList)}
              accept="image/*"
              fileList={productImage}
            >
              {productImage.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Thông tin biến thể",
      content: (
        <div>
          <Form form={variantForm} layout="vertical">
            <Space style={{ width: "100%" }} size="large">
              <Form.Item
                name="tb_size_id"
                label="Kích thước"
                style={{ width: "100%" }}
              >
                <Select
                  allowClear
                  placeholder="Select size"
                  defaultValue={null}
                >
                  <Select.Option value={null}>Không chọn</Select.Option>
                  {sizes.map((size) => (
                    <Select.Option key={size.id} value={size.id}>
                      {size.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="tb_color_id"
                label="Màu sắc"
                style={{ width: "100%" }}
              >
                <Select
                  allowClear
                  placeholder="Select color"
                  defaultValue={null}
                >
                  <Select.Option value={null}>Không chọn</Select.Option>
                  {colors.map((color) => (
                    <Select.Option key={color.id} value={color.id}>
                      {color.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Space>

            <Space style={{ width: "100%" }} size="large">
              <Form.Item
                name="sku"
                label="Mã hàng"
                rules={[{ required: true, message: "Please enter SKU" }]}
                style={{ width: "100%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="price"
                label="giá biến thể"
                rules={[{ required: true, message: "Please enter price" }]}
                style={{ width: "100%" }}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[{ required: true, message: "Please enter quantity" }]}
                style={{ width: "100%" }}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Space>

            <Form.Item
              name="status"
              label="Trạng thái"
              initialValue="còn hàng"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="còn hàng">Còn hàng</Select.Option>
                <Select.Option value="hết hàng">Hết hàng</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="images" label="Ảnh biến thể">
              <Upload
                listType="picture-card"
                multiple
                maxCount={4}
                beforeUpload={() => false}
                accept="image/*"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Button type="primary" onClick={handleVariantAdd}>
              Add Variant
            </Button>
          </Form>
          {variants.length > 0 && (
            <Card title="Biến thể đã thêm" className="mt-4 shadow-sm mb-4">
              {variants.map((variant, index) => (
                <Card.Grid
                  key={index}
                  style={{ width: "100%" }}
                  className="p-4 hover:bg-light"
                >
                  <div className="d-flex">
                    {/* Cột hình ảnh bên trái */}
                    <div className="me-4" style={{ width: "120px" }}>
                      {variant.images && variant.images.length > 0 && (
                        <div className="position-relative">
                          <img
                            src={variant.images[0].url}
                            alt="Main variant"
                            className="rounded w-100 mb-2 shadow-sm"
                            style={{ aspectRatio: "1/1", objectFit: "cover" }}
                          />
                          {variant.images.length > 1 && (
                            <div className="d-flex gap-1 overflow-auto">
                              {variant.images
                                .slice(1)
                                .map((image: any, imgIndex: number) => (
                                  <img
                                    key={imgIndex}
                                    src={image.url}
                                    alt={`Variant ${imgIndex + 1}`}
                                    className="rounded shadow-sm"
                                    style={{
                                      width: "35px",
                                      height: "35px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Cột thông tin bên phải */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="row w-100">
                          <div className="col-md-6">
                            {variant.tb_size_id && (
                              <div className="mb-2 d-flex">
                                <span
                                  className="text-muted me-2"
                                  style={{ width: "100px" }}
                                >
                                  Kích thước:
                                </span>
                                <span className="fw-medium">
                                  {
                                    sizes.find(
                                      (s) => s.id === variant.tb_size_id
                                    )?.name
                                  }
                                </span>
                              </div>
                            )}
                            {variant.tb_color_id && (
                              <div className="mb-2 d-flex">
                                <span
                                  className="text-muted me-2"
                                  style={{ width: "100px" }}
                                >
                                  Màu sắc:
                                </span>
                                <span className="fw-medium">
                                  {
                                    colors.find(
                                      (c) => c.id === variant.tb_color_id
                                    )?.name
                                  }
                                </span>
                              </div>
                            )}
                            <div className="mb-2 d-flex">
                              <span
                                className="text-muted me-2"
                                style={{ width: "100px" }}
                              >
                                Mã hàng:
                              </span>
                              <span className="fw-medium">{variant.sku}</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-2 d-flex">
                              <span
                                className="text-muted me-2"
                                style={{ width: "100px" }}
                              >
                                Giá:
                              </span>
                              <span className="fw-medium text-primary">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(variant.price)}
                              </span>
                            </div>
                            <div className="mb-2 d-flex">
                              <span
                                className="text-muted me-2"
                                style={{ width: "100px" }}
                              >
                                Số lượng:
                              </span>
                              <span className="fw-medium">
                                {variant.quantity}
                              </span>
                            </div>
                            <div className="mt-3">
                              <Button
                                danger
                                size="small"
                                onClick={() => handleRemoveVariant(index)}
                              >
                                Xóa biến thể
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Grid>
              ))}
            </Card>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <Steps current={currentStep} items={steps} className="mb-8" />
        {steps[currentStep].content}

        <div className="flex justify-between mt-6">
          <Button onClick={() => navigate("/admin/product")}>
            Back to List
          </Button>
          <Space>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep((step) => step - 1)}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                className="ml-4"
                type="primary"
                onClick={async () => {
                  try {
                    await productForm.validateFields();
                    if (!productImage) {
                      throw new Error("Product image is required");
                    }
                    setCurrentStep((step) => step + 1);
                  } catch (error) {
                    if (error instanceof Error) {
                      message.error(error.message);
                    }
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                Thêm sản phẩm
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default ProductSteps;
