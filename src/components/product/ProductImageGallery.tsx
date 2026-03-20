import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';

interface ProductImageGalleryProps {
  images: string[];
  thumbnail: string;
  title: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, thumbnail, title }) => {
  const [selectedImage, setSelectedImage] = useState(thumbnail);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSelectedImage(thumbnail);
    setIsLoaded(false); // Reset loaded state when thumbnail changes
  }, [thumbnail]);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image View */}
      <div className="relative group aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 items-center justify-center flex p-4">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <Spin size="large" />
          </div>
        )}
        <img
          src={selectedImage}
          alt={title}
          className={`max-w-full max-h-full object-contain transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } group-hover:scale-110`}
          onLoad={() => setIsLoaded(true)}
          key={selectedImage} // Trigger animation on image change
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=No+Image';
            setIsLoaded(true); // Ensure spinner is hidden even if image fails to load
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                if (selectedImage !== img) {
                  setIsLoaded(false);
                  setSelectedImage(img);
                }
              }}
              className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
                selectedImage === img
                  ? 'border-blue-600 shadow-md shadow-blue-100 scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-200'
              }`}
            >
              <img
                src={img}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
