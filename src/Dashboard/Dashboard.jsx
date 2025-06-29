import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../AdminDashboard/NavBar";

const Dashboard = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const mergeProducts = (apiProducts, localProducts) => {
    const locallyAdded = localProducts.filter(
      (product) => !apiProducts.find((apiProduct) => apiProduct.id === product.id)
    );

    const transformedLocalProducts = locallyAdded.map((product) => ({
      id: product.id,
      title: product.name || product.brandname,
      price: parseFloat(product.price) / 80,
      description: product.collectionname || product.partnersname || '',
      category: product.brandname || 'local',
      image: product.image,
      rating: {
        rate: 4.0,
        count: 0,
      },
      brandname: product.brandname,
      collectionname: product.collectionname,
      partnersname: product.partnersname,
      color: product.color,
      size: product.size,
      name: product.name,
      isLocalProduct: true,
    }));

    return [...apiProducts, ...transformedLocalProducts];
  };

  const fetchAndMergeProducts = async () => {
    try {
      setLoading(true);
      const localProducts = JSON.parse(localStorage.getItem("products") || "[]");
      const res = await axios.get("https://fakestoreapi.com/products");
      const apiProducts = res.data;
      const mergedProducts = mergeProducts(apiProducts, localProducts);

      setProducts(mergedProducts);
      localStorage.setItem("mergedProducts", JSON.stringify(mergedProducts));
      localStorage.setItem("apiProducts", JSON.stringify(apiProducts));
      localStorage.setItem("productsLastUpdated", Date.now().toString());
    } catch (err) {
      console.error("Error fetching products:", err);

      const cachedMerged = localStorage.getItem("mergedProducts");
      const localProducts = localStorage.getItem("products");

      if (cachedMerged) {
        setProducts(JSON.parse(cachedMerged));
      } else if (localProducts) {
        const parsedLocalProducts = JSON.parse(localProducts);
        const transformedProducts = parsedLocalProducts.map((product) => ({
          id: product.id,
          title: product.name || product.brandname,
          price: parseFloat(product.price) / 80,
          description: product.collectionname || product.partnersname || '',
          category: product.brandname || 'local',
          image: product.image,
          rating: { rate: 4.0, count: 0 },
          brandname: product.brandname,
          collectionname: product.collectionname,
          partnersname: product.partnersname,
          color: product.color,
          size: product.size,
          name: product.name,
          isLocalProduct: true,
        }));
        setProducts(transformedProducts);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFromLocalStorage = () => {
    try {
      const localProducts = JSON.parse(localStorage.getItem("products") || "[]");
      const cachedApiProducts = JSON.parse(localStorage.getItem("apiProducts") || "[]");

      const mergedProducts = mergeProducts(cachedApiProducts, localProducts);
      setProducts(mergedProducts);
      localStorage.setItem("mergedProducts", JSON.stringify(mergedProducts));
    } catch (error) {
      console.error("Error updating from localStorage:", error);
    }
  };

  const checkForUpdates = () => {
    const adminUpdated = localStorage.getItem("adminProductsUpdated");
    const lastChecked = localStorage.getItem("dashboardLastChecked");

    if (adminUpdated && adminUpdated !== lastChecked) {
      updateFromLocalStorage();
      localStorage.setItem("dashboardLastChecked", adminUpdated);
    }
  };

  useEffect(() => {
    const cachedMerged = localStorage.getItem("mergedProducts");
    if (cachedMerged) {
      setProducts(JSON.parse(cachedMerged));
      setLoading(false);
    }

    fetchAndMergeProducts();

    const interval = setInterval(checkForUpdates, 2000);

    const handleStorageChange = (e) => {
      if (e.key === "adminProductsUpdated" || e.key === "products") {
        updateFromLocalStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      checkForUpdates();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const showDetails = (index) => {
    const product = products[index];
    navigate("/product-detail", { state: product });
  };

  const handleAddToCart = (item) => {
    const exists = cart.find((cartItem) => cartItem.id === item.id);
    if (!exists) {
      setCart([...cart, item]);
    }
  };

  const goToCart = () => {
    navigate("/cart");
  };

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
      <div className="flex flex-col sticky top-0 z-50">
        <NavBar />
      </div>

      <div className="flex justify-between items-center px-3 sm:px-5 py-3 sm:py-5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Our Products</h2>
        <button onClick={goToCart}>
          <div className="flex border border-zinc-500 text-indigo-500 text-sm sm:text-base md:text-[18px] gap-1 sm:gap-2 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
            <i className="fa-solid fa-cart-shopping text-lg sm:text-xl md:text-[26px]"></i>
            <span className="hidden xs:inline">Cart</span>
            <p className="text-zinc-900">({cart.length})</p>
          </div>
        </button>
      </div>

      <div className="px-3 sm:px-5 pb-5 bg-white">
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {products.map((item, index) => {
            const inCart = cart.some((cartItem) => cartItem.id === item.id);

            return (
              <div
                key={item.id}
                className={`border border-[#ccc] p-2 sm:p-3 flex flex-col justify-between gap-2 rounded-xl sm:rounded-2xl transition duration-500 hover:scale-105 hover:shadow-lg bg-white ${
                  item.isLocalProduct ? "ring-1 sm:ring-2 ring-blue-200" : ""
                }`}
              >
                <div className="flex flex-col flex-grow">
                  {item.isLocalProduct && (
                    <div className="mb-1 sm:mb-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-[10px] xs:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        New Product
                      </span>
                    </div>
                  )}

                  <div className="h-32 xs:h-36 sm:h-40 md:h-44 lg:h-48 mb-2 sm:mb-3 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => showDetails(index)}
                    />
                  </div>

                  <div className="flex flex-col p-1 sm:p-2 gap-2 sm:gap-4 flex-grow">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <span
                        className="text-sm sm:text-base md:text-lg font-bold cursor-pointer line-clamp-2 hover:text-blue-600 transition-colors"
                        onClick={() => showDetails(index)}
                        title={item.title}
                      >
                        {item.title}
                      </span>

                      <p
                        className="text-xs sm:text-sm md:text-md text-gray-600 line-clamp-2 sm:line-clamp-3"
                        title={item.description}
                      >
                        {item.description}
                      </p>

                      <div className="flex gap-0.5 sm:gap-1 text-xs sm:text-sm md:text-lg my-1 sm:my-2">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa-${i < Math.round(item.rating?.rate || 4) ? "solid" : "regular"} fa-star text-orange-600`}
                          ></i>
                        ))}
                      </div>

                      <p
                        className="text-base sm:text-lg md:text-xl font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => showDetails(index)}
                      >
                        ₹ {item.isLocalProduct ? item.price * 80 : Math.round(item.price * 80)}
                      </p>
                    </div>
                  </div>
                </div>

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
      </div>
    </div>
  );
};

export default Dashboard;
