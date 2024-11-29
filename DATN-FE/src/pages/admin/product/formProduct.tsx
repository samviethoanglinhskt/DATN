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
  GetProp,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type {
  UploadFile,
  UploadChangeParam,
  UploadProps,
} from "antd/es/upload";
import axiosInstance from "src/config/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

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
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
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

  // const handleProductImageChange = (info: UploadChangeParam<UploadFile>) => {
  //   const { fileList } = info;
  //   if (fileList?.[0]?.originFileObj) {
  //     setProductImage(fileList[0].originFileObj);
  //   }
  // };

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
      formData.append("image", productImage[0]?.originFileObj);      

      // Add variants with null handling
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

      const response = await axiosInstance.post("/api/product", formData);

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

          <Form.Item
            label="Product Image"
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
      title: "Variants",
      content: (
        <div>
          <Form form={variantForm} layout="vertical">
            <Space style={{ width: "100%" }} size="large">
              <Form.Item
                name="tb_size_id"
                label="Size"
                style={{ width: "100%" }}
              >
                <Select
                  allowClear
                  placeholder="Select size"
                  defaultValue={null}
                >
                  <Select.Option value={null}>No Size</Select.Option>
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
                style={{ width: "100%" }}
              >
                <Select
                  allowClear
                  placeholder="Select color"
                  defaultValue={null}
                >
                  <Select.Option value={null}>No Color</Select.Option>
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
                label="SKU"
                rules={[{ required: true, message: "Please enter SKU" }]}
                style={{ width: "100%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please enter price" }]}
                style={{ width: "100%" }}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Please enter quantity" }]}
                style={{ width: "100%" }}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Space>

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
                  <div className="flex justify-between">
                    <div>
                      {variant.tb_size_id && (
                        <p>
                          Size:{" "}
                          {sizes.find((s) => s.id === variant.tb_size_id)?.name}
                        </p>
                      )}
                      {variant.tb_color_id && (
                        <p>
                          Color:{" "}
                          {
                            colors.find((c) => c.id === variant.tb_color_id)
                              ?.name
                          }
                        </p>
                      )}
                      <p>SKU: {variant.sku}</p>
                      <p>Price: {variant.price}</p>
                      <p>Quantity: {variant.quantity}</p>
                    </div>
                    <Button danger onClick={() => handleRemoveVariant(index)}>
                      Remove
                    </Button>
                  </div>
                  {variant.images && variant.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {variant.images.map((image: any, imgIndex: number) => (
                        <img
                          key={imgIndex}
                          src={image.url}
                          alt={`Variant ${imgIndex}`}
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                        />
                      ))}
                    </div>
                  )}
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
