export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
  weight: number;
  stock: number;
  minimumOrderQuantity: number;
  images: string[];
  tags: string[];
  dimensions: ProductDimensions;
  meta: ProductMeta;
  reviews: ProductReview[];
  availabilityStatus: string;
  returnPolicy: string;
  shippingInformation: string;
  warrantyInformation: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}
