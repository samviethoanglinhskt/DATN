import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Card, Steps, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import type { UploadProps } from 'antd/es/upload';
import axiosInstance from 'src/config/axiosInstance';

interface Product {
  id: number;
  tb_category_id: number;
  tb_brand_id: number;
  name: string;
  image: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
  variants: Variant[];
}

interface Variant {
  id?: number;
  tb_product_id: number;
  tb_size_id: number;
  tb_color_id: number;
  sku: string;
  price: number;
  quantity: number;
  status: string;
  images: { name_image: string }[];
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Size {
  id: number;
  name: string;
}

interface Color {
  id: number;
  name: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [variants, setVariants] = useState<any[]>([]);
  const [productImage, setProductImage] = useState<RcFile | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    fetchInitialData();
  }, []);
  useEffect(() => {
    if (editingProduct) {
      // Khi chỉnh sửa sản phẩm, khôi phục dữ liệu vào form
      productForm.setFieldsValue({
        name: editingProduct.name,
        tb_category_id: editingProduct.tb_category_id,
        tb_brand_id: editingProduct.tb_brand_id,
        status: editingProduct.status,
        description: editingProduct.description,
      });
      setPreviewImage(`http://127.0.0.1:8000/${editingProduct.image}`);
    }
  }, [editingProduct]); // Sử dụng effect để cập nhật form khi có sản phẩm đang chỉnh sửa


  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBrands(),
        fetchSizes(),
        fetchColors(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/api/product-list');
      setProducts(response.data.data);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/category');
      setCategories(response.data);
    } catch (error) {
      message.error('Failed to fetch categories');
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axiosInstance.get('/api/brand');
      setBrands(response.data);
    } catch (error) {
      message.error('Failed to fetch brands');
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axiosInstance.get('/api/size');
      setSizes(response.data);
    } catch (error) {
      message.error('Failed to fetch sizes');
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axiosInstance.get('/api/color');
      setColors(response.data);
    } catch (error) {
      message.error('Failed to fetch colors');
    }
  };
  const handleProductImageChange: UploadProps['onChange'] = ({ file }) => {
    console.log(file);  // Check the file object for debugging purposes

    if (file.status !== 'removed') {
      const fileObj = file.originFileObj;

      // Ensure fileObj is a valid File object (or Blob)
      if (fileObj && fileObj instanceof Blob) {
        setProductImage(fileObj);
        setPreviewImage(URL.createObjectURL(fileObj));  // Generate a preview URL for the image
      } else {
        setProductImage(null);
        setPreviewImage('');
        message.error('Định dạng tệp không hợp lệ');
      }
    } else {
      setProductImage(null);
      setPreviewImage('');
    }
  };

  // Hàm thêm biến thể mới
  const handleVariantAdd = async () => {
    try {
      const values = await variantForm.validateFields();
      const newVariant = {
        ...values,
        images: values.images?.fileList?.map((file: UploadFile) => ({
          originFileObj: file.originFileObj,
          url: URL.createObjectURL(file.originFileObj as Blob),
        })) || [],
      };

      // Thêm biến thể vào state
      setVariants(prev => [...prev, newVariant]);
      variantForm.resetFields();
      message.success('Variant added successfully');
    } catch (error) {
      message.error('Please fill all required fields');
    }
  };

  const handleSubmit = async () => {
    try {
      const productValues = await productForm.validateFields();
      const formData = new FormData();

      // Append product data
      Object.keys(productValues).forEach(key => {
        if (key !== 'image') {
          formData.append(key, productValues[key]);
        }
      });

      // Append product image
      if (productImage) {
        formData.append('imagePr', productImage); // Sửa từ 'image' thành 'imagePr'
      }

      // Append variants
      variants.forEach((variant, index) => {
        Object.keys(variant).forEach(key => {
          if (key === 'images') {
            variant.images.forEach((image: any, imageIndex: number) => {
              formData.append(`variants[${index}][imageVa][${imageIndex}]`, image.originFileObj); // Sửa từ 'images' thành 'imageVa'
            });
          } else {
            formData.append(`variants[${index}][${key}]`, variant[key]);
          }
        });
      });

      if (editingProduct) {
        await axiosInstance.post(`/api/product/${editingProduct.id}`, formData);
        message.success('Product updated successfully');
      } else {
        await axiosInstance.post('/api/product', formData);
        message.success('Product created successfully');
      }

      resetForms();
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Failed to save product');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/product/${id}`);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const resetForms = () => {
    productForm.resetFields();
    variantForm.resetFields();
    setVariants([]);
    setCurrentStep(0);
    setEditingProduct(null);
    setProductImage(null);
    setPreviewImage('');
  };

  const steps = [
    {
      title: 'Product Information',
      content: (
        <Form form={productForm} layout="vertical">
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tb_category_id" label="Danh mục" rules={[{ required: true }]}>
            <Select>
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="tb_brand_id" label="Thương hiệu" rules={[{ required: true }]}>
            <Select>
              {brands.map(brand => (
                <Select.Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="còn hàng">Còn hàng</Select.Option>
              <Select.Option value="hết hàng">Hết hàng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="image" label="Hình ảnh" required>
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={(file) => {
                // Validate file type (image formats like png, jpg, jpeg, gif)
                const isImage = file.type.startsWith('image/');

                // If the file is not an image, display an error
                if (!isImage) {
                  message.error('Vui lòng tải lên tệp hình ảnh (jpg, png, jpeg, gif).');
                }

                // Return true to allow the file if it's an image
                return isImage;
              }}
              onChange={handleProductImageChange}
              showUploadList={previewImage ? false : true}
            >
              {previewImage ? (
                <img src={previewImage} alt="product" style={{ width: '100%' }} />
              ) : (
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
      title: 'Variants',
      content: (
        <div>
          <Form form={variantForm} layout="vertical">
            <Form.Item name="tb_size_id" label="Kích thước" rules={[{ required: true }]}>
              <Select>
                {sizes.map(size => (
                  <Select.Option key={size.id} value={size.id}>
                    {size.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="tb_color_id" label="Màu sắc" rules={[{ required: true }]}>
              <Select>
                {colors.map(color => (
                  <Select.Option key={color.id} value={color.id}>
                    {color.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="còn hàng">Còn hàng</Select.Option>
                <Select.Option value="hết hàng">Hết hàng</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="images" label="Hình ảnh biến thể">
              <Upload
                listType="picture-card"
                multiple
                beforeUpload={() => false}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Button type="primary" onClick={handleVariantAdd}>
              Thêm biến thể
            </Button>
          </Form>

          {variants.length > 0 && (
            <Card title="Biến thể đã thêm" className="mt-4">
              {variants.map((variant, index) => (
                <Card.Grid key={index} style={{ width: '100%' }}>
                  <p>Kích thước: {sizes.find(s => s.id === variant.tb_size_id)?.name}</p>
                  <p>Màu sắc: {colors.find(c => c.id === variant.tb_color_id)?.name}</p>
                  <p>SKU: {variant.sku}</p>
                  <p>Giá: {variant.price}</p>
                  <p>Số lượng: {variant.quantity}</p>
                  <div className="flex gap-2">
                    {variant.images?.map((image: any, imgIndex: number) => (
                      <img
                        key={imgIndex}
                        src={image.url}
                        alt={`Variant ${imgIndex}`}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
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
  const columns: ColumnsType<Product> = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img
          src={`http://127.0.0.1:8000/${image}`}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'tb_category_id',
      key: 'category',
      render: (categoryId: number) => categories.find(c => c.id === categoryId)?.name || '-',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'tb_brand_id',
      key: 'brand',
      render: (brandId: number) => brands.find(b => b.id === brandId)?.name || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'còn hàng' ? '#52c41a' : '#f5222d' }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Số biến thể',
      key: 'variants',
      render: (_, record) => record.variants?.length || 0,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              productForm.setFieldsValue({
                ...record,
                image: undefined // Reset image field since we'll handle it separately
              });
              setPreviewImage(`http://127.0.0.1:8000/${record.image}`);

              // Setup variants
              if (record.variants) {
                setVariants(record.variants.map(variant => ({
                  ...variant,
                  images: variant.images.map(img => ({
                    url: `http://127.0.0.1:8000/${img.name_image}`,
                    name_image: img.name_image
                  }))
                })));
              }

              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý sản phẩm"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            resetForms();
            setModalVisible(true);
          }}
        >
          Thêm sản phẩm
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          resetForms();
        }}
        width={800}
        footer={null}
      >
        <Steps current={currentStep} items={steps} className="mb-8" />
        <div>{steps[currentStep].content}</div>
        <div className="flex justify-end gap-2 mt-4">
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(current => current - 1)}>
              Quay lại
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button
              type="primary"
              onClick={async () => {
                try {
                  if (currentStep === 0) {
                    await productForm.validateFields();
                  }
                  setCurrentStep(current => current + 1);
                } catch (error) {
                  message.error('Vui lòng điền đầy đủ thông tin!');
                }
              }}
            >
              Tiếp theo
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={handleSubmit}>
              {editingProduct ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default ProductManagement;