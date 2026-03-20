import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Input,
  Select,
  Rate,
  Tag,
  Button,
  Pagination,
  Row,
  Col,
  Skeleton,
  Spin,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import {
  setSearchQuery,
  setSelectedCategory,
  setCurrentPage,
  setPageSize,
} from '@/features/products/productsSlice';
import { useGetProductsQuery, useGetCategoriesQuery } from '@/api/productsApi';
import useDebounce from '@/hooks/useDebounce';
import PageWrapper from '@/components/common/PageWrapper';
import ErrorState from '@/components/common/ErrorState';
import type { Product } from '@/types';

const { Search } = Input;

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux State
  const { searchQuery, selectedCategory, currentPage, pageSize } = useAppSelector(
    (state) => state.products
  );

  // Local State for Search Input
  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce Search
  const debouncedSearch = useDebounce(inputValue, 400);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
    dispatch(setCurrentPage(1));
  }, [debouncedSearch, dispatch]);

  // RTK Query
  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery({
    limit: pageSize,
    skip: (currentPage - 1) * pageSize,
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
  });

  const { data: categoriesData } = useGetCategoriesQuery();

  // Columns Definition
  const columns: ColumnsType<Product> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Rate disabled allowHalf defaultValue={rating} style={{ fontSize: 14 }} />
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => {
        let color = 'green';
        if (stock === 0) color = 'red';
        else if (stock <= 10) color = 'orange';
        return <Tag color={color}>{stock > 0 ? stock : 'Out of Stock'}</Tag>;
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/products/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  if (isError) {
    return (
      <PageWrapper title="Products">
        <ErrorState onRetry={refetch} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Products">
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Search products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              allowClear
              enterButton
              size="large"
            />
          </Col>
          <Col xs={24} md={12} className="md:text-right">
            <Select
              placeholder="All Categories"
              style={{ width: 200 }}
              allowClear
              options={categoriesData?.map((cat) => ({
                value: typeof cat === 'string' ? cat : cat.slug,
                label: typeof cat === 'string' ? cat : cat.name,
              }))}
              value={selectedCategory || undefined}
              onChange={(value) => {
                dispatch(setSelectedCategory(value || ''));
                dispatch(setCurrentPage(1));
              }}
              size="large"
            />
          </Col>
        </Row>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton.Button
              key={i}
              active
              size="large"
              shape="square"
              style={{ width: '100%', height: 48 }}
            />
          ))}
        </div>
      ) : (
        <div className="relative">
          {isFetching && !isLoading && (
            <div className="absolute top-2 right-2 z-10">
              <Spin size="small" />
            </div>
          )}
          <Table
            columns={columns}
            dataSource={data?.products || []}
            rowKey="id"
            pagination={false}
            className={`shadow-sm border rounded-lg overflow-hidden transition-opacity ${
              isFetching ? 'opacity-50' : 'opacity-100'
            }`}
          />
          <div className="mt-6 flex justify-end">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={data?.total || 0}
              onChange={(page) => dispatch(setCurrentPage(page))}
              onShowSizeChange={(_, size) => {
                dispatch(setPageSize(size));
                dispatch(setCurrentPage(1));
              }}
              showSizeChanger
              showTotal={(total) => `Total ${total} products`}
            />
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default ProductListPage;
