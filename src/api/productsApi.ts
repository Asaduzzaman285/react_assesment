import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, ProductsResponse, Category, ProductListParams } from '@/types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductListParams>({
      query: (params) => {
        const { limit, skip, search, category } = params;
        if (search) {
          return `products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
        }
        if (category) {
          return `products/category/${category}?limit=${limit}&skip=${skip}`;
        }
        return `products?limit=${limit}&skip=${skip}`;
      },
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `products/${id}`,
    }),
    getCategories: builder.query<Category[], void>({
      query: () => 'products/categories',
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
} = productsApi;
