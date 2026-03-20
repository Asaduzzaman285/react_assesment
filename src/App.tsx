import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

const ProductListPage = lazy(() => import('@/pages/ProductList'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetail'));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Spin size="large" />
          </div>
        }
      >
        <Routes>
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
