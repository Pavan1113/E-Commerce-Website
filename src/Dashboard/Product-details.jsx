import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Don't render if no product data
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === product.id);
    
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity
      };
      setCart(updatedCart);
    } else {
      const newItem = {
        ...product,
        quantity: quantity,
        addedAt: new Date().toISOString()
      };
      setCart([...cart, newItem]);
    }
    
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuy = () => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === product.id);
    
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity
      };
      setCart(updatedCart);
    } else {
      const newItem = {
        ...product,
        quantity: quantity,
        addedAt: new Date().toISOString()
      };
      setCart([...cart, newItem]);
    }
    
    navigate('/Cart')
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={i} className="fas fa-star text-yellow-400 text-sm sm:text-lg"></i>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <i key="half" className="fas fa-star-half-alt text-yellow-400 text-sm sm:text-lg"></i>
      );
    }
    
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <i key={i} className="far fa-star text-gray-300 text-sm sm:text-lg"></i>
      );
    }
    
    return stars;
  };

  // Handle multiple images or single image
  const productImages = product.images || [product.image];
  const currentImage = productImages[selectedImage] || product.image;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Container with proper responsive padding */}
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Back Button - Mobile optimized */}
        <div className="pb-4 sm:pb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm sm:text-base"
          >
            <i className="fas fa-arrow-left text-sm"></i>
            <span className="hidden sm:inline">Back to Products</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Main Grid - Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 pb-8 sm:pb-12">
          
          {/* Image Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className={`relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl sm:shadow-2xl transition-all duration-700 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              <div className="aspect-square p-4 sm:p-6 lg:p-8">
                <img
                  src={currentImage}
                  alt={product.collectionname || product.brandname}
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                  }}
                />
              </div>
              
              {/* Image overlay effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Share button - Responsive size */}
              <button className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                <i className="fas fa-share-alt text-gray-700 text-sm sm:text-base"></i>
              </button>
            </div>
            
            {/* Thumbnail Images - Responsive grid */}
            {productImages.length > 1 && (
              <div className="flex gap-2 sm:gap-3 justify-start sm:justify-center overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-blue-500 shadow-lg scale-105 sm:scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6 sm:space-y-8">
            {/* Brand and Title */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.brandname || product.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 font-medium">
                {product.collectionname || product.category}
              </p>
            </div>

            {/* Rating - Mobile optimized */}
            {product.rating && (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating.rate)}
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {product.rating.rate} {product.reviews && `(${product.reviews} reviews)`}
                </span>
              </div>
            )}

            {/* Price - Responsive sizing */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                ₹{product.price ? product.price.toLocaleString() : '0'}
              </span>
              {product.price && (
                <>
                  <span className="text-base sm:text-lg text-gray-500 line-through">
                    ₹{Math.round(product.price * 1.2).toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Save 17%
                  </span>
                </>
              )}
            </div>

            {/* Product Options - Mobile friendly grid */}
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {product.color && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Color</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-900 rounded-full border-2 border-white shadow-md"></div>
                      <span className="text-gray-700 text-sm sm:text-base">{product.color}</span>
                    </div>
                  </div>
                )}
                {product.size && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Size</label>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-700 text-sm sm:text-base">{product.size}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity - Touch friendly buttons */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors touch-manipulation"
                  >
                    <i className="fas fa-minus text-sm"></i>
                  </button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors touch-manipulation"
                  >
                    <i className="fas fa-plus text-sm"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile optimized */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                  onClick={handleAddToCart}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-full sm:w-14 h-12 sm:h-16 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center transition-all duration-300 touch-manipulation ${
                    isWishlisted 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  }`}
                >
                  <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart text-lg sm:text-xl`}></i>
                  <span className="ml-2 sm:hidden text-sm">
                    {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </span>
                </button>
              </div>
              
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base touch-manipulation"
                onClick={handleBuy}
              >
                Buy Now
              </button>
            </div>

            {/* Features - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-truck text-blue-600 text-sm sm:text-base"></i>
                </div>
                <div className="text-left sm:text-center">
                  <p className="font-medium text-gray-900 text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">Orders over ₹999</p>
                </div>
              </div>
              
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-shield-alt text-green-600 text-sm sm:text-base"></i>
                </div>
                <div className="text-left sm:text-center">
                  <p className="font-medium text-gray-900 text-sm">Warranty</p>
                  <p className="text-xs text-gray-500">2 year coverage</p>
                </div>
              </div>
              
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-undo-alt text-orange-600 text-sm sm:text-base"></i>
                </div>
                <div className="text-left sm:text-center">
                  <p className="font-medium text-gray-900 text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">30 day policy</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-3 pt-4 sm:pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>
              </div>
            )}

            {/* Additional Features - Mobile optimized */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                <i className="fas fa-sparkles text-purple-500"></i>
                Special Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-500 flex-shrink-0"></i>
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-500 flex-shrink-0"></i>
                  <span>Eco-Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-500 flex-shrink-0"></i>
                  <span>Handcrafted</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-500 flex-shrink-0"></i>
                  <span>Limited Edition</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden">
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm touch-manipulation"
            onClick={handleAddToCart}
          >
            <i className="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
          <button 
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-4 rounded-xl text-sm touch-manipulation"
            onClick={handleBuy}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 sm:hidden"></div>
    </div>
  );
};

export default Product;