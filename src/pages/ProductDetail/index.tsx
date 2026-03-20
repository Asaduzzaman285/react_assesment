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
    <PageWrapper title="Product Showcase">
      <div className="mb-0 flex items-center justify-between">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="!flex items-center gap-2 border-none shadow-none text-slate-500 hover:text-blue-600 px-0"
        >
          Back to list
        </Button>
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<EditOutlined />}
            onClick={() => setDrawerOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 border-none hover:opacity-90 shadow-md shadow-blue-200"
          >
            Edit Specs
          </Button>
          <Button
            size="large"
            className="border-slate-200 text-slate-600"
          >
            Share
          </Button>
        </Space>
      </div>

      <Divider className="my-6 opacity-50" />

      <Row gutter={[48, 48]}>
        {/* Left Column: Image Gallery */}
        <Col xs={24} lg={11}>
          <div className="sticky top-8">
            <ProductImageGallery
              images={product.images}
              thumbnail={product.thumbnail}
              title={product.title}
            />
          </div>
        </Col>

        {/* Right Column: Product Info */}
        <Col xs={24} lg={13}>
          <div className="flex flex-col gap-6">
            <div>
              <Space className="mb-3">
                <Tag color="blue" className="!rounded-full !px-3 font-semibold uppercase text-[10px] tracking-widest border-none bg-blue-50 text-blue-600">
                  {product!.category}
                </Tag>
                {product!.brand && (
                  <Tag className="!rounded-full !px-3 font-semibold uppercase text-[10px] tracking-widest border-none bg-slate-100 text-slate-500">
                    {product!.brand}
                  </Tag>
                )}
              </Space>
              <Title level={1} className="!m-0 !text-4xl !font-extrabold tracking-tight text-slate-900 leading-tight">
                {product!.title}
              </Title>
              <div className="mt-4 flex items-center gap-4">
                <Space align="center" className="bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <Rate disabled allowHalf defaultValue={product!.rating} style={{ fontSize: 16 }} className="text-amber-500" />
                  <Text strong className="text-amber-700 mt-1">
                    {product!.rating}
                  </Text>
                </Space>
                <Text className="text-slate-400 text-sm">
                  Verified Purchase
                </Text>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="flex items-baseline gap-3">
                <Text className="text-4xl font-black text-slate-900">
                  ${product!.price ? product!.price.toFixed(2) : '0.00'}
                </Text>
                {product!.discountPercentage > 0 && (
                  <div className="flex flex-col">
                    <Text delete className="text-slate-400 text-sm">
                      ${(product!.price / (1 - product!.discountPercentage / 100)).toFixed(2)}
                    </Text>
                    <Tag color="red" className="!m-0 !rounded-full text-[11px] font-bold border-none">
                      SAVE {product!.discountPercentage}%
                    </Tag>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Badge
                  status={
                    product!.stock > 10
                      ? 'success'
                      : product!.stock > 0
                      ? 'warning'
                      : 'error'
                  }
                  text={
                    <Text className={`font-semibold ${
                      product!.stock > 10 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {product!.stock > 0
                        ? `${product!.stock} Units left in stock`
                        : 'Currently Out of Stock'}
                    </Text>
                  }
                />
              </div>
            </div>

            <div className="mt-2">
              <Title level={5} className="!uppercase !text-xs !font-bold !tracking-widest !text-slate-400 !mb-3">
                Description
              </Title>
              <Paragraph className="text-slate-600 leading-relaxed text-lg">
                {product!.description}
              </Paragraph>
            </div>

            <div className="flex flex-wrap gap-2">
              {product!.tags?.map((tag) => (
                <Tag key={tag} className="!bg-white !border-slate-100 !text-slate-500 !rounded-lg !px-3 font-medium">
                  #{tag}
                </Tag>
              ))}
            </div>

            <Divider className="my-2" />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <div className="flex flex-col">
                 <Text className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Weight</Text>
                 <Text className="font-semibold text-slate-700">{product!.weight}g</Text>
               </div>
               <div className="flex flex-col">
                 <Text className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Warranty</Text>
                 <Text className="font-semibold text-slate-700">{product!.warrantyInformation}</Text>
               </div>
               <div className="flex flex-col">
                 <Text className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Shipping</Text>
                 <Text className="font-semibold text-slate-700">{product!.shippingInformation}</Text>
               </div>
               <div className="flex flex-col">
                 <Text className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">SKU</Text>
                 <Text className="font-semibold text-slate-700">{product!.sku}</Text>
               </div>
            </div>
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
