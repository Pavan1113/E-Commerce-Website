import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../AdminDashboard/NavBar";

const Dashboard = () => {
  const navigate = useNavigate();

  // Initialize cart from localStorage with error handling
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart data:", error);
      localStorage.removeItem("cart");
      return [];
    }
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Transform API product to our format
  const transformApiProduct = (apiProduct) => ({
    id: `api_${apiProduct.id}`, // Add prefix to avoid conflicts
    title: apiProduct.title,
    price: parseFloat(apiProduct.price),
    description: apiProduct.description,
    category: apiProduct.category,
    image: apiProduct.image,
    rating: apiProduct.rating,
    isLocalProduct: false,
  });

  // Transform local product to our format (admin products)
  const transformLocalProduct = (localProduct) => ({
    id: `local_${localProduct.id}`, // Add prefix to avoid conflicts
    title: localProduct.name || localProduct.brandname,
    price: parseFloat(localProduct.price),
    description: localProduct.collectionname || localProduct.partnersname || localProduct.name || '',
    category: localProduct.brandname || 'local',
    image: localProduct.image,
    rating: {
      rate: 4.0,
      count: 0,
    },
    brandname: localProduct.brandname,
    collectionname: localProduct.collectionname,
    partnersname: localProduct.partnersname,
    color: localProduct.color,
    size: localProduct.size,
    name: localProduct.name,
    isLocalProduct: true,
  });

  // Load products from localStorage (admin products)
  const loadLocalProducts = () => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      console.log("Raw stored products:", storedProducts);
      
      // Filter and transform only local products (from admin panel)
      const localProducts = storedProducts
        .filter(product => 
          // Check if it's a local product (has properties that admin products have)
          product.name || product.brandname || product.isLocalProduct === true
        )
        .map(transformLocalProduct);
      
      console.log("Transformed local products:", localProducts);
      return localProducts;
    } catch (error) {
      console.error("Error loading local products from localStorage:", error);
      return [];
    }
  };

  // Fetch API products and merge with local products
  const fetchAndMergeProducts = async () => {
    try {
      setLoading(true);
      
      // Load local products from localStorage
      const localProducts = loadLocalProducts();
      
      // Fetch API products
      const res = await axios.get("https://fakestoreapi.com/products");
      const apiProducts = res.data.map(transformApiProduct);
      
      // Combine API products with local products
      const allProducts = [...apiProducts, ...localProducts];
      
      console.log("All merged products:", allProducts);
      setProducts(allProducts);
      
    } catch (err) {
      console.error("Error fetching API products:", err);
      
      // If API fails, just show local products
      const localProducts = loadLocalProducts();
      setProducts(localProducts);
    } finally {
      setLoading(false);
    }
  };

  // Update products when localStorage changes
  const updateProductsFromStorage = () => {
    console.log("Updating products from storage...");
    const localProducts = loadLocalProducts();
    
    setProducts(prevProducts => {
      // Keep API products and replace local products
      const apiProducts = prevProducts.filter(p => !p.isLocalProduct);
      const updatedProducts = [...apiProducts, ...localProducts];
      console.log("Updated products:", updatedProducts);
      return updatedProducts;
    });
  };

  // Check for updates from admin panel
  const checkForUpdates = () => {
    const adminUpdated = localStorage.getItem("adminProductsUpdated");
    const productsUpdated = localStorage.getItem("productsLastUpdated");
    const lastChecked = localStorage.getItem("dashboardLastChecked");

    const latestUpdate = Math.max(
      parseInt(adminUpdated || "0"),
      parseInt(productsUpdated || "0")
    ).toString();

    if (latestUpdate !== lastChecked && latestUpdate !== "0") {
      console.log("New products detected from admin panel, updating dashboard...");
      updateProductsFromStorage();
      localStorage.setItem("dashboardLastChecked", latestUpdate);
    }
  };

  // Listen for real-time localStorage changes
  const handleStorageChange = (e) => {
    if (e.key === "products" || e.key === "adminProductsUpdated" || e.key === "productsLastUpdated") {
      console.log("Storage change detected for key:", e.key);
      setTimeout(() => {
        updateProductsFromStorage();
      }, 100); // Small delay to ensure localStorage is updated
    }
  };

  // Main effect for loading products and setting up listeners
  useEffect(() => {
    fetchAndMergeProducts();
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(checkForUpdates, 500);
    const handleFocus = () => {
      checkForUpdates();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Force update when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForUpdates();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Navigate to product details
  const showDetails = (index) => {
    const product = products[index];
    navigate("/product-detail", { state: product });
  };

  // Add item to cart
  const handleAddToCart = (item) => {
    const exists = cart.find((cartItem) => cartItem.id === item.id);
    if (!exists) {
      setCart([...cart, item]);
    }
  };

  // Navigate to cart
  const goToCart = () => {
    navigate("/cart");
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col sticky top-0 z-50">
          <NavBar />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-base sm:text-xl text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="flex flex-col sticky top-0 z-50">
        <NavBar />
      </div>

      {/* Header with Cart Button */}
      <div className="flex justify-between items-center px-3 sm:px-5 py-3 sm:py-5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Our Products ({products.length})
        </h2>
        <button onClick={goToCart}>
          <div className="flex border border-zinc-500 text-indigo-500 text-sm sm:text-base md:text-[18px] gap-1 sm:gap-2 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
            <i className="fa-solid fa-cart-shopping text-lg sm:text-xl md:text-[26px]"></i>
            <span className="hidden xs:inline">Cart</span>
            <p className="text-zinc-900">({cart.length})</p>
          </div>
        </button>
      </div>

      {/* Products Grid */}
      <div className="px-3 sm:px-5 pb-5 bg-white">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {products.map((item, index) => {
              const inCart = cart.some((cartItem) => cartItem.id === item.id);

              return (
                <div
                  key={item.id}
                  className={`border border-[#ccc] p-2 sm:p-3 flex flex-col justify-between gap-2 rounded-xl sm:rounded-2xl transition duration-500 hover:scale-105 hover:shadow-lg bg-white ${
                    item.isLocalProduct ? "ring-1 sm:ring-2 ring-blue-200 bg-blue-50/20" : ""
                  }`}
                >
                  <div className="flex flex-col flex-grow">
                    {/* New Product Badge */}
                    {item.isLocalProduct && (
                      <div className="mb-1 sm:mb-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-[10px] xs:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                          ✨ New Product
                        </span>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="h-32 xs:h-36 sm:h-40 md:h-44 lg:h-48 mb-2 sm:mb-3 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => showDetails(index)}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col p-1 sm:p-2 gap-2 sm:gap-4 flex-grow">
                      <div className="flex flex-col gap-1 sm:gap-2">
                        {/* Product Title */}
                        <span
                          className="text-sm sm:text-base md:text-lg font-bold cursor-pointer line-clamp-2 hover:text-blue-600 transition-colors"
                          onClick={() => showDetails(index)}
                          title={item.title}
                        >
                          {item.title}
                        </span>

                        {/* Additional Product Info for Local Products */}
                        {item.isLocalProduct && (
                          <div className="text-xs text-gray-600">
                            {item.color && <span className="inline-block mr-2">Color: {item.color}</span>}
                            {item.size && <span className="inline-block">Size: {item.size}</span>}
                          </div>
                        )}

                        {/* Product Description */}
                        <p
                          className="text-xs sm:text-sm md:text-md text-gray-600 line-clamp-2 sm:line-clamp-3"
                          title={item.description}
                        >
                          {item.description}
                        </p>

                        {/* Rating Stars */}
                        <div className="flex gap-0.5 sm:gap-1 text-xs sm:text-sm md:text-lg my-1 sm:my-2">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-${i < Math.round(item.rating?.rate || 4) ? "solid" : "regular"} fa-star text-orange-600`}
                            ></i>
                          ))}
                        </div>

                        {/* Product Price */}
                        <p
                          className="text-base sm:text-lg md:text-xl font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => showDetails(index)}
                        >
                          ₹ {item.isLocalProduct ? Math.round(item.price) : Math.round(item.price * 80)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart / Go to Cart Button */}
                  <div className="flex justify-center mt-2 sm:mt-0">
                    {inCart ? (
                      <button
                        className="hover:bg-green-700 bg-[#16a34a] text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md w-full text-xs sm:text-sm md:text-base font-medium transition-colors"
                        onClick={goToCart}
                      >
                        Go to Cart
                      </button>
                    ) : (
                      <button
                        className="hover:bg-[#1d4ed8] bg-[#2563eb] text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md w-full text-xs sm:text-sm md:text-base font-medium transition-colors"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;