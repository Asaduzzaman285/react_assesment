import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Rate,
  Badge,
  Divider,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Skeleton,
  Result,
  message as antMessage,
} from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useGetProductByIdQuery } from '@/api/productsApi';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import PageWrapper from '@/components/common/PageWrapper';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // RTK Query
  const { data: product, isLoading, isError } = useGetProductByIdQuery(
    Number(id)
  );

  // Pre-fill form when product data is available
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        title: product.title,
        price: product.price,
        stock: product.stock,
        description: product.description,
        discountPercentage: product.discountPercentage,
      });
    }
  }, [product, form]);

  const onFinish = (values: any) => {
    console.log('Form Values:', values);
    antMessage.success('Product updated successfully (local console only)');
    setDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <PageWrapper title="Loading Product...">
        <div className="p-4">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </PageWrapper>
    );
  }

  if (isError || !product) {
    return (
      <PageWrapper title="Product Error">
        <Result
          status="404"
          title="Product not found"
          extra={
            <Button type="primary" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          }
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Product Details">
      <div className="mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Back
        </Button>
      </div>

      <Row gutter={[32, 32]}>
        {/* Left Column: Image Gallery */}
        <Col xs={24} md={10}>
          <ProductImageGallery
            images={product.images}
            thumbnail={product.thumbnail}
            title={product.title}
          />
        </Col>

        {/* Right Column: Product Info */}
        <Col xs={24} md={14}>
          <div className="flex flex-col gap-4">
            <div>
              <Title level={2} className="m-0">
                {product.title}
              </Title>
              <Space className="mt-2">
                <Tag color="purple">{product.category}</Tag>
                <Tag color="gold">{product.brand}</Tag>
              </Space>
            </div>

            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <Tag key={tag} color="blue">
                  {tag}
                </Tag>
              ))}
            </div>

            <div className="mt-2">
              <Space align="center">
                <Text className="text-3xl font-bold text-blue-600">
                  ${product.price}
                </Text>
                {product.discountPercentage > 0 && (
                  <Tag color="red" className="ml-2">
                    -{product.discountPercentage}% OFF
                  </Tag>
                )}
              </Space>
            </div>

            <Space align="center">
              <Rate disabled allowHalf defaultValue={product.rating} />
              <Text strong className="text-gray-500">
                ({product.rating})
              </Text>
            </Space>

            <div>
              <Badge
                status={
                  product.stock > 10
                    ? 'success'
                    : product.stock > 0
                    ? 'warning'
                    : 'error'
                }
                text={
                  <Text strong className="text-lg">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : 'Out of Stock'}
                  </Text>
                }
              />
            </div>

            <Divider />

            <div>
              <Title level={4}>Description</Title>
              <Paragraph className="text-gray-600 leading-relaxed">
                {product.description}
              </Paragraph>
            </div>

            <Space className="mt-6">
              <Button
                type="primary"
                size="large"
                icon={<EditOutlined />}
                onClick={() => setDrawerOpen(true)}
              >
                Edit Product
              </Button>
            </Space>
          </div>
        </Col>
      </Row>

      {/* Edit Drawer */}
      <Drawer
        title="Edit Product"
        placement="right"
        onClose={() => {
          setDrawerOpen(false);
          form.resetFields();
        }}
        open={drawerOpen}
        width={480}
        extra={
          <Button type="primary" onClick={() => form.submit()}>
            Save Changes
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: 'Please enter the product title' },
              { min: 3, message: 'Title must be at least 3 characters' },
            ]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price ($)"
                rules={[
                  { required: true, message: 'Price is required' },
                  { type: 'number', min: 0.01, message: 'Price must be greater than 0' },
                ]}
              >
                <InputNumber style={{ width: '100%' }} precision={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Stock"
                rules={[
                  { required: true, message: 'Stock is required' },
                  { type: 'integer', min: 0, message: 'Stock cannot be negative' },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="discountPercentage"
            label="Discount %"
            rules={[
              { type: 'number', min: 0, max: 100, message: 'Range 0-100' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} precision={2} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Description is required' },
              { max: 500, message: 'Maximum 500 characters' },
            ]}
          >
            <Input.TextArea rows={6} placeholder="Enter product description" />
          </Form.Item>
        </Form>
      </Drawer>
    </PageWrapper>
  );
};

export default ProductDetailPage;
