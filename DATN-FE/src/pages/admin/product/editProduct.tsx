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
  Spin,
  Modal,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { UploadFile, UploadChangeParam } from "antd/es/upload";
import axiosInstance from "src/config/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;

interface IVariantImage {
  id?: number;
  url: string;
  name?: string;
}

interface IVariant {
  id: number;
  tb_size_id: number;
  tb_color_id: number;
  sku: string;
  price: number;
  quantity: number;
  status: string;
  images?: (IVariantImage | string)[];
}

interface IProduct {
  id: number;
  name: string;
  tb_category_id: number;
  tb_brand_id: number;
  status: string;
  description?: string;
  image: string;
  variants: IVariant[];
}

const ProductEdit: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [productForm] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [variants, setVariants] = useState<IVariant[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isEditingVariant, setIsEditingVariant] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<IVariant | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, categoriesRes, brandsRes, sizesRes, colorsRes] =
        await Promise.all([
          axiosInstance.get(`/api/product/${id}`),
          axiosInstance.get("/api/category"),
          axiosInstance.get("/api/brand"),
          axiosInstance.get("/api/size"),
          axiosInstance.get("/api/color"),
        ]);

      setProduct(productRes.data);
      setVariants(productRes.data.variants || []);
      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
      setSizes(sizesRes.data);
      setColors(colorsRes.data);

      // Đặt giá trị mặc định cho form nếu dữ liệu đã tải thành công
      productForm.setFieldsValue({
        name: productRes.data.name,
        tb_category_id: productRes.data.tb_category_id || null,
        tb_brand_id: productRes.data.tb_brand_id || null,
        status: productRes.data.status,
        description: productRes.data.description,
      });

      if (productRes.data.image) {
        setFileList([
          {
            uid: "-1",
            name: "Product Image",
            status: "done",
            url: `http://127.0.0.1:8000/${productRes.data.image}`,
          },
        ]);
      }
    } catch (error) {
      console.error("Fetch data error:", error);
      message.error("Không thể tải dữ liệu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleProductImageChange = (info: UploadChangeParam<UploadFile>) => {
    const { fileList: newFileList, file } = info;

    if (newFileList.length === 0) {
      setProductImage(null);
      setFileList([]);
      return;
    }

    if (file) {
      const isLessThan5MB = file.size / 1024 / 1024 < 5;
      if (!isLessThan5MB) {
        message.error("Image must be smaller than 5MB");
        return;
      }

      const isValidType = file.type.startsWith("image/");
      if (!isValidType) {
        message.error("You can only upload image files");
        return;
      }

      setFileList(newFileList);
      setProductImage(file);
    }
  };

  const handleProductUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", productForm.getFieldValue("name"));
      formData.append(
        "tb_category_id",
        productForm.getFieldValue("tb_category_id").toString()
      );
      formData.append(
        "tb_brand_id",
        productForm.getFieldValue("tb_brand_id").toString()
      );
      formData.append("status", productForm.getFieldValue("status"));
      formData.append(
        "description",
        productForm.getFieldValue("description") || ""
      );
      formData.append("_method", "PUT");

      if (productImage) {
        formData.append("image", productImage);
      }

      // Handle variants data
      variants.forEach((variant: any, index) => {
        formData.append(`variants[${index}][id]`, variant.id.toString());
        formData.append(
          `variants[${index}][tb_size_id]`,
          variant.tb_size_id?.toString() || ""
        );
        formData.append(
          `variants[${index}][tb_color_id]`,
          variant.tb_color_id?.toString() || ""
        );
        formData.append(`variants[${index}][sku]`, variant.sku.toString());
        formData.append(`variants[${index}][price]`, variant.price.toString());
        formData.append(
          `variants[${index}][quantity]`,
          variant.quantity.toString()
        );
        formData.append(`variants[${index}][status]`, variant.status);

        // Handle variant images
        if (variant.images) {
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

      const response = await axiosInstance.post(
        `/api/product/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data?.product?.id) {
        message.success("Cập nhật sản phẩm thành công");
        navigate("/admin/product");
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      message.error(error.message || "Cập nhật sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleVariantEdit = (variant: IVariant) => {
    setCurrentVariant(variant);

    const variantImages =
      variant.images?.map((img: any, index: number) => ({
        uid: `-${index}`,
        name: `Image ${index + 1}`,
        status: "done",
        url:
          typeof img === "string"
            ? `http://127.0.0.1:8000/${img}`
            : `http://127.0.0.1:8000/${img.url}`,
      })) || [];

    variantForm.setFieldsValue({
      ...variant,
      images: variantImages,
    });

    setIsEditingVariant(true);
  };

  const handleVariantDelete = async (variantId: number) => {
    try {
      await axiosInstance.delete(`/api/variants/${variantId}`);
      setVariants(variants.filter((v) => v.id !== variantId));
      message.success("Variant deleted successfully");
    } catch (error) {
      console.error("Delete variant error:", error);
      message.error("Failed to delete variant");
    }
  };
  const handleVariantUpdate = async () => {
    try {
      if (!currentVariant) return;
      const values = await variantForm.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("_method", "PUT");

      const variantIndex = variants.findIndex(
        (v) => v.id === currentVariant.id
      );
      if (variantIndex === -1) throw new Error("Variant not found");

      Object.keys(values).forEach((key) => {
        if (key !== "images") {
          formData.append(
            `variants[${variantIndex}][${key}]`,
            values[key]?.toString() || ""
          );
        }
      });

      if (values.images) {
        values.images.forEach((image: any, imageIndex: number) => {
          if (image.originFileObj) {
            formData.append(
              `variants[${variantIndex}][images][${imageIndex}][name_image]`,
              image.originFileObj
            );
          }
        });
      }

      const response = await axiosInstance.post(
        `/api/product/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data?.product) {
        message.success("Cập nhật variant thành công");
        setIsEditingVariant(false);
        const updatedVariants = [...variants];
        updatedVariants[variantIndex] = {
          ...updatedVariants[variantIndex],
          ...values,
        };
        setVariants(updatedVariants);
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật variant:", error);
      message.error(error.response?.data?.error || "Cập nhật variant thất bại");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Thông tin sản phẩm",
      content: (
        <Form form={productForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tb_category_id"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn Danh mục" }]}
          >
            <Select placeholder="Chọn Danh mục">
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="flex">
            <div>
              <Form.Item
                name="tb_brand_id"
                label="Thương hiệu"
                rules={[
                  { required: true, message: "Vui lòng chọn Thương hiệu" },
                ]}
              >
                <Select placeholder="Chọn Thương hiệu">
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
            </div>
            <Form.Item
              label="Ảnh sản phẩm"
              required
              tooltip="Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP"
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleProductImageChange}
                beforeUpload={() => false}
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>
        </Form>
      ),
    },
    {
      title: "Thông tin biến thể",
      content: (
        <div>
          {variants.length > 0 && (
            <Card title="Biến thể sản phẩm" className="mb-4">
              {variants.map((variant) => (
                <Card.Grid key={variant.id} style={{ width: "100%" }}>
                  <div className="row">
                    {/* Cột ảnh sản phẩm (Bên trái) */}
                    <div className="col-md-4 d-flex justify-content-center align-items-center">
                      {variant.images?.map((image: any, index: number) => (
                        <img
                          key={index}
                          src={`http://127.0.0.1:8000/storage/${image.name_image}`}
                          alt={`Variant Image ${index}`}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>

                    {/* Cột thông tin sản phẩm (Bên phải) */}
                    <div className="col-md-8">
                      <div className="d-flex">
                        <div>
                          <p>
                            <strong> Kích thước: </strong>{" "}
                            {
                              sizes.find((s) => s.id === variant.tb_size_id)
                                ?.name
                            }
                          </p>
                          <p>
                            <strong> Màu sắc:</strong>{" "}
                            {
                              colors.find((c) => c.id === variant.tb_color_id)
                                ?.name
                            }
                          </p>
                          <p>
                            <strong> Mã hàng:</strong> {variant.sku}
                          </p>
                        </div>
                        <div className="ml-5">
                          <p>
                            <strong> Giá sản phẩm: </strong> {variant.price}
                          </p>
                          <p>
                            <strong>Số lượng: </strong>
                            {variant.quantity}
                          </p>
                          <p>
                            <strong>Trạng thái:</strong> {variant.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Các nút Sửa và Xóa */}
                  <div className="d-flex justify-content-between mt-2">
                    <Space>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleVariantEdit(variant)}
                      >
                        Sửa biến thể
                      </Button>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleVariantDelete(variant.id)}
                      >
                        Xóa biến thể
                      </Button>
                    </Space>
                  </div>
                </Card.Grid>
              ))}
            </Card>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <Steps current={currentStep} items={steps} className="mb-8" />
        {steps[currentStep].content}

        <div className="flex justify-between mt-6">
          <Button onClick={() => navigate("/admin/product")}>
            Trang danh sách
          </Button>
          <Space>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep((step) => step - 1)}>
                Quay lại
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                onClick={() => setCurrentStep((step) => step + 1)}
              >
                Tiếp tục
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleProductUpdate}
                loading={loading}
              >
                Cập nhật sản phẩm
              </Button>
            )}
          </Space>
        </div>
      </Card>

      <Modal
        title="Sửa biến thể"
        open={isEditingVariant}
        onOk={handleVariantUpdate}
        onCancel={() => setIsEditingVariant(false)}
        width={800}
      >
        <Form form={variantForm} layout="vertical">
          <Form.Item name="tb_size_id" label="Kích thước">
            <Select allowClear>
              {sizes.map((size) => (
                <Select.Option key={size.id} value={size.id}>
                  {size.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tb_color_id" label="Màu sắc">
            <Select allowClear>
              {colors.map((color) => (
                <Select.Option key={color.id} value={color.id}>
                  {color.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="sku" label="Mã hàng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá biến thể"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value: any) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
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

          <Form.Item
            name="images"
            label="Ảnh biến thể"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList || [];
            }}
          >
            <Upload
              listType="picture-card"
              multiple
              maxCount={4}
              beforeUpload={() => false}
              accept="image/jpeg,image/png,image/gif,image/webp"
              onPreview={(file) => {
                if (file.url) {
                  window.open(file.url);
                }
              }}
              onChange={(info) => {
                const { file } = info;
                if (file.originFileObj) {
                  const isLessThan5MB =
                    file.originFileObj.size / 1024 / 1024 < 5;
                  if (!isLessThan5MB) {
                    message.error("Image must be smaller than 5MB");
                    return;
                  }

                  const isValidType =
                    file.originFileObj.type.startsWith("image/");
                  if (!isValidType) {
                    message.error("You can only upload image files");
                    return;
                  }
                }
              }}
            >
              {(variantForm.getFieldValue("images")?.length || 0) >=
              4 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductEdit;
