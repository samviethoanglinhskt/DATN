
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
import type { UploadFile, UploadChangeParam } from "antd/es/upload";
import axiosInstance from "src/config/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;

interface IVariant {
  tb_size_id: number;
  tb_color_id: number;
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
  const [productImage, setProductImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

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

  const handleProductImageChange = (info: UploadChangeParam<UploadFile>) => {
    console.log(info);
    const { file } = info;
    if (file.originFileObj) {
      setProductImage(file.originFileObj);
    }
  };

  const handleVariantAdd = async () => {
    try {
      const values = await variantForm.validateFields();
      const newVariant: IVariant = {
        ...values,
        images: values.images?.fileList?.map((file: any) => ({
          originFileObj: file.originFileObj,
          url: URL.createObjectURL(file.originFileObj),
        })),
      };
      setVariants([...variants, newVariant]);
      variantForm.resetFields();
      message.success("Variant added");
    } catch (error) {
      message.error("Please fill all required fields");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const productValues = productForm.getFieldsValue(true);

      // Validate required fields
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

      // Add product info
      formData.append("tb_category_id", productValues.tb_category_id);
      formData.append("tb_brand_id", productValues.tb_brand_id);
      formData.append("name", productValues.name);
      formData.append("status", productValues.status);
      formData.append("image", productImage);

      // Add variants with required structure
      variants.forEach((variant: any, index) => {
        formData.append(`variants[${index}][tb_size_id]`, variant.tb_size_id);
        formData.append(`variants[${index}][tb_color_id]`, variant.tb_color_id);
        formData.append(`variants[${index}][sku]`, variant.sku);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][quantity]`, variant.quantity);
        formData.append(`variants[${index}][status]`, variant.status);

        // Add variant images with correct structure
        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((image: any, imgIndex: number) => {
            if (image.originFileObj) {
              formData.append(
                `variants[${index}][images][${imgIndex}][name_image]`,
                image.originFileObj,
                image.originFileObj.name // Include original filename
              );
            }
          });
        }
      });

      // Debug log
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axiosInstance.post("/api/product", formData);
      console.log(response);

      if (response.data.success) {
        message.success("Product created successfully");
        navigate("/products");
      }
    } catch (error) {
      console.error(error);
      message.error(
        error instanceof Error ? error.message : "Failed to save product"
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Product Information",
      content: (
        <Form
          form={productForm}
          layout="vertical"
          initialValues={{ status: "còn hàng" }}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tb_category_id"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
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
            label="Brand"
            rules={[{ required: true, message: "Please select brand" }]}
          >
            <Select>
              {brands.map((brand) => (
                <Select.Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="còn hàng">In Stock</Select.Option>
              <Select.Option value="hết hàng">Out of Stock</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Product Image" name={"product_image"} required validateTrigger={["onBlur", "onChange"]}>
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleProductImageChange}
              accept="image/*"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Variants",
      content: (
        <div>
          <Form form={variantForm} layout="vertical">
            <Form.Item
              name="tb_size_id"
              label="Size"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select size">
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
              <Select placeholder="Select color">
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
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              initialValue="còn hàng"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="còn hàng">In Stock</Select.Option>
                <Select.Option value="hết hàng">Out of Stock</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="images" label="Variant Images">
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
            <Card title="Added Variants" className="mt-4">
              {variants.map((variant, index) => (
                <Card.Grid key={index} style={{ width: "100%" }}>
                  <p>
                    Size: {sizes.find((s) => s.id === variant.tb_size_id)?.name}
                  </p>
                  <p>
                    Color:{" "}
                    {colors.find((c) => c.id === variant.tb_color_id)?.name}
                  </p>
                  <p>SKU: {variant.sku}</p>
                  <p>Price: {variant.price}</p>
                  <p>Quantity: {variant.quantity}</p>
                  <div className="flex gap-2">
                    {variant.images?.map((image: any, imgIndex: number) => (
                      <img
                        key={imgIndex}
                        src={image.url}
                        alt={`Variant ${imgIndex}`}
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                    ))}
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
          <Button onClick={() => navigate("/admin/product")}>Back to List</Button>
          <Space>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep((step) => step - 1)}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
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
                Create Product
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default ProductSteps;
