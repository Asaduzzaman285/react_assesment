import React, { useState, useEffect } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  thumbnail: string;
  title: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  thumbnail,
  title,
}) => {
  const [selectedImage, setSelectedImage] = useState(thumbnail);

  useEffect(() => {
    setSelectedImage(thumbnail);
  }, [thumbnail]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/400x400?text=No+Image';
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-4">
        <img
          src={selectedImage}
          alt={title}
          className="max-w-full max-h-full object-contain"
          onError={handleImageError}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, index) => (
            <div
              key={index}
              className={`w-20 h-20 p-2 cursor-pointer rounded-md border-2 transition-all ${
                selectedImage === img
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt={`${title} - ${index}`}
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
