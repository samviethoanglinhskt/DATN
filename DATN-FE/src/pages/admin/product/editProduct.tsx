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
import "./ProductList.css";

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

      variants.forEach((variant: any, index) => {
        formData.append(`variants[${index}][tb_size_id]`, variant.tb_size_id);
        formData.append(`variants[${index}][tb_color_id]`, variant.tb_color_id);
        formData.append(`variants[${index}][sku]`, variant.sku);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][quantity]`, variant.quantity);
        formData.append(`variants[${index}][status]`, variant.status);

        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((image: any, imgIndex: number) => {
            if (image.originFileObj) {
              formData.append(
                `variants[${index}][images][${imgIndex}][name_image]`,
                image.originFileObj,
                image.originFileObj.name
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
      console.log("Lỗi cập nhật sản phẩm:", error);
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

      // Add all variant fields
      const variantIndex = variants.findIndex(
        (v) => v.id === currentVariant.id
      );
      if (variantIndex === -1) throw new Error("Variant not found");

      Object.keys(values).forEach((key) => {
        if (key !== "images") {
          formData.append(
            `variants[${variantIndex}][${key}]`,
            values[key].toString()
          );
        }
      });

      // Handle new images
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
        // Update local variants state
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
      title: "Product Information",
      content: (
        <Form form={productForm} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
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
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="còn hàng">In Stock</Select.Option>
                  <Select.Option value="hết hàng">Out of Stock</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="description" label="Description">
                <TextArea rows={4} />
              </Form.Item>
              </div>
              <Form.Item
                label="Product Image"
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
      title: "Variants",
      content: (
        <div>
          {variants.length > 0 && (
            <Card title="Product Variants" className="mb-4">
              {variants.map((variant) => (
                <Card.Grid key={variant.id} style={{ width: "100%" }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p>
                        Size:{" "}
                        {sizes.find((s) => s.id === variant.tb_size_id)?.name}
                      </p>
                      <p>
                        Color:{" "}
                        {colors.find((c) => c.id === variant.tb_color_id)?.name}
                      </p>
                      <p>SKU: {variant.sku}</p>
                      <p>Price: {variant.price}</p>
                      <p>Quantity: {variant.quantity}</p>
                      <p>Status: {variant.status}</p>
                      <div className="flex gap-2 mt-2">
                        {variant.images?.map((image: any, index: number) => (
                          <img
                            key={index}
                            src={`http://127.0.0.1:8000/${
                              typeof image === "string" ? image : image.url
                            }`}
                            alt={`Variant ${index}`}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <Space>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleVariantEdit(variant)}
                      >
                        Edit
                      </Button>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleVariantDelete(variant.id)}
                      >
                        Delete
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
                type="primary"
                onClick={() => setCurrentStep((step) => step + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleProductUpdate}
                loading={loading}
              >
                Update Product
              </Button>
            )}
          </Space>
        </div>
      </Card>

      <Modal
        title="Edit Variant"
        open={isEditingVariant}
        onOk={handleVariantUpdate}
        onCancel={() => setIsEditingVariant(false)}
        width={800}
      >
        <Form form={variantForm} layout="vertical">
          <Form.Item
            name="tb_size_id"
            label="Size"
            rules={[{ required: true }]}
          >
            <Select>
              {sizes.map((size) => (
                <Select.Option key={size.id} value={size.id}>
                  {size.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tb_color_id"
            label="Color"
            rules={[{ required: true }]}
          >
            <Select>
              {colors.map((color) => (
                <Select.Option key={color.id} value={color.id}>
                  {color.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
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
            label="Quantity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="còn hàng">In Stock</Select.Option>
              <Select.Option value="hết hàng">Out of Stock</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="images"
            label="Variant Images"
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
