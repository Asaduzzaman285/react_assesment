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
    <PageWrapper title="Product Catalog">
      <div className="mb-8 p-6 bg-white/50 rounded-2xl border border-slate-100 shadow-sm">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={14}>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Search Products</span>
              <Search
                placeholder="Find something special..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                allowClear
                enterButton="Search"
                size="large"
                className="custom-search"
              />
            </div>
          </Col>
          <Col xs={24} lg={10}>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Category Filter</span>
              <Select
                placeholder="All Categories"
                className="w-full"
                allowClear
                options={categoriesData?.map((cat) => ({
                  value: typeof cat === 'string' ? cat : cat.slug,
                  label: typeof cat === 'string' ? cat : (cat.name || cat.slug),
                }))}
                value={selectedCategory || undefined}
                onChange={(value) => {
                  dispatch(setSelectedCategory(value || ''));
                  dispatch(setCurrentPage(1));
                }}
                size="large"
              />
            </div>
          </Col>
        </Row>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              active
              avatar={{ shape: 'square', size: 'large' }}
              paragraph={{ rows: 1 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"
            />
          ))}
        </div>
      ) : (
        <div className="relative">
          {isFetching && !isLoading && (
            <div className="absolute -top-12 right-0 z-10 flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold animate-pulse border border-blue-100">
              <Spin size="small" /> Updating...
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <Table
              columns={columns}
              dataSource={data?.products || []}
              rowKey="id"
              pagination={false}
              rowClassName="group cursor-pointer hover:bg-slate-50/80 transition-colors"
              onRow={(record) => ({
                onClick: () => navigate(`/products/${record.id}`),
              })}
              className="custom-table"
            />
          </div>
          <div className="mt-8 flex justify-center sm:justify-end bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
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
              showTotal={(total) => (
                <span className="font-medium text-slate-500">
                  Total <span className="text-blue-600 font-bold">{total}</span> items
                </span>
              )}
            />
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default ProductListPage;
