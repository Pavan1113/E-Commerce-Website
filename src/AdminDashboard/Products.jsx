import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Leftsidebar from "./Leftsidebar";
import { image } from "../images";

const ProductDropdown = ({
  isOpen,
  onEdit,
  onDelete,
  onClose,
  dropdownRef,
}) => {
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-20 py-1 min-w-44 border border-gray-200 animate-dropdown"
    >
      <button
        onClick={onEdit}
        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 w-full text-left transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <i className="fa-solid fa-pen-to-square text-blue-500"></i>
        </div>
        <span className="font-medium">Edit</span>
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 w-full text-left transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
          <i className="fa-solid fa-trash text-red-500"></i>
        </div>
        <span className="font-medium">Delete</span>
      </button>
    </div>
  );
};

const ProductModal = ({ isOpen, product, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    brandname: "",
    partnersname: "",
    collectionname: "",
    color: "",
    size: "",
    price: "",
    image: "",
    imageName: "",
  });

  const getBrands = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("brand") || "[]");
    } catch (error) {
      console.error("Error parsing brands from localStorage:", error);
      return [];
    }
  }, []);

  const getPartners = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("partners") || "[]");
    } catch (error) {
      console.error("Error parsing partners from localStorage:", error);
      return [];
    }
  }, []);

  const getCollections = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("collection") || "[]");
    } catch (error) {
      console.error("Error parsing collections from localStorage:", error);
      return [];
    }
  }, []);

  const brands = useMemo(() => getBrands(), [getBrands]);
  const partners = useMemo(() => getPartners(), [getPartners]);
  const collections = useMemo(() => getCollections(), [getCollections]);

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: product?.name || "",
        brandname: product?.brandname || "",
        partnersname: product?.partnersname || "",
        collectionname: product?.collectionname || "",
        color: product?.color || "",
        size: product?.size || "",
        price: product?.price || "",
        image: product?.image || "",
        imageName: product?.imageName || "",
      });
    }
  }, [isOpen, product]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "price"
        ? value.replace(/[^0-9.]/g, "")
        : value
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    let updatedProduct = { ...formData, [name]: formattedValue };

    if (name === "brandname") {
      updatedProduct.partnersname = "";
      updatedProduct.collectionname = "";
    }

    if (name === "partnersname") {
      updatedProduct.collectionname = "";
    }

    setFormData(updatedProduct);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image (PNG, JPEG, JPG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result,
        imageName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedImage = () => {
    setFormData({ ...formData, image: "", imageName: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.brandname ||
      !formData.price ||
      !formData.image
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (isNaN(parseFloat(formData.price))) {
      alert("Please enter a valid price");
      return;
    }
    onSave(formData);
  };

  const filteredPartners = useMemo(() => {
    return partners.filter(
      (partner) => partner.brandname === formData.brandname
    );
  }, [partners, formData.brandname]);

  const filteredCollections = useMemo(() => {
    return collections.filter(
      (collection) =>
        collection.brandname === formData.brandname &&
        collection.partnersname === formData.partnersname
    );
  }, [collections, formData.brandname, formData.partnersname]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden animate-scale-in"
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <img src={image.remove} alt="Close" width="20" height="20" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto"
        >
          <div className="mb-4">
            <label
              htmlFor="brandSelect"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Brand Name <span className="text-red-500">*</span>
            </label>
            <select
              id="brandSelect"
              name="brandname"
              value={formData.brandname}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
              required
              aria-required="true"
            >
              <option value="" disabled>
                Select Brand
              </option>
              {brands.map((brand, idx) => (
                <option key={idx} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="partnerSelect"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Partner Name
            </label>
            <select
              id="partnerSelect"
              name="partnersname"
              value={formData.partnersname}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
              disabled={!formData.brandname}
            >
              <option value="" disabled>
                Select Partner
              </option>
              {filteredPartners.map((partner, idx) => (
                <option key={idx} value={partner.name}>
                  {partner.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="collectionSelect"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Collection Name
            </label>
            <select
              id="collectionSelect"
              name="collectionname"
              value={formData.collectionname}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
              disabled={!formData.partnersname}
            >
              <option value="" disabled>
                Select Collection
              </option>
              {filteredCollections.map((collection, idx) => (
                <option key={idx} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="productName"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
              required
              aria-required="true"
              minLength={2}
              maxLength={50}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="colorInput"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Color
            </label>
            <input
              id="colorInput"
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Enter color"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
              maxLength={20}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="sizeSelect"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Size
            </label>
            <select
              id="sizeSelect"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
            >
              <option value="" disabled>
                Select Size
              </option>
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="priceInput"
              className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
            >
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                id="priceInput"
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="w-full pl-8 pr-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                required
                aria-required="true"
                inputMode="decimal"
                pattern="[0-9.]*"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Product Image <span className="text-red-500">*</span>
            </label>

            {!formData.image ? (
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/jpg"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                  required={!isEditing}
                  aria-required={!isEditing}
                />
                <p className="text-xs text-gray-500">
                  Accepted formats: PNG, JPEG, JPG. Max size: 2MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-700 truncate max-w-xs">
                    {formData.imageName}
                  </span>
                  <button
                    type="button"
                    onClick={clearSelectedImage}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                {formData.image && (
                  <div className="h-32 overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !formData.name.trim() ||
                !formData.brandname ||
                !formData.price ||
                !formData.image
              }
              className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
                formData.name.trim() &&
                formData.brandname &&
                formData.price &&
                formData.image
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-300 text-white cursor-not-allowed"
              } transition-colors`}
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmptyState = ({ onAddProduct }) => (
  <div className="text-center py-8 sm:py-12">
    <div className="mb-4">
      <img
        src={image.dots}
        alt="No products"
        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto opacity-30"
      />
    </div>
    <p className="text-gray-500 text-base sm:text-lg mb-2">
      No products added yet.
    </p>
    <p className="text-gray-400 mb-4 text-sm sm:text-base">
      Add your first product to get started
    </p>
    <button
      onClick={onAddProduct}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
    >
      <i className="fa-solid fa-plus mr-2"></i>
      Add Your First Product
    </button>
  </div>
);

const Products = () => {
  const navigate = useNavigate();
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [animation, setAnimation] = useState({ index: null, type: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig] = useState({ key: null, direction: "ascending" });

  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const updateProductsInStorage = useCallback((newProducts) => {
    try {
      localStorage.setItem("products", JSON.stringify(newProducts));
      localStorage.setItem("adminProductsUpdated", Date.now().toString());
      localStorage.setItem("productsLastUpdated", Date.now().toString());
    } catch (error) {
      console.error("Error saving products to localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
      }
    } catch (error) {
      console.error("Error loading products from localStorage:", error);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    if (products.length >= 0) {
      updateProductsInStorage(products);
    }
  }, [products, updateProductsInStorage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openModal = useCallback((productToEdit = null, index = null) => {
    setCurrentProduct(productToEdit);
    setEditIndex(index);
    setIsModalOpen(true);
    setActiveDropdownIndex(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setEditIndex(null);
  }, []);

  const handleSubmit = useCallback(
    (formData) => {
      if (editIndex !== null) {
        setAnimation({ index: editIndex, type: "update" });

        setTimeout(() => {
          setProducts((prev) => {
            const updatedProducts = prev.map((product, i) =>
              i === editIndex ? { ...formData, id: product.id } : product
            );
            return updatedProducts;
          });

          setTimeout(() => {
            setAnimation({ index: null, type: null });
          }, 600);
        }, 300);
      } else {
        const newId =
          products.length > 0
            ? Math.max(...products.map((p) => p.id || 0)) + 1
            : 1;

        const newProduct = {
          ...formData,
          id: newId,
          isLocalProduct: true,
          rating: {
            rate: 4.0,
            count: 0,
          },
        };

        setProducts((prev) => {
          const newProducts = [...prev, newProduct];
          return newProducts;
        });
      }

      closeModal();
    },
    [editIndex, products, closeModal]
  );

  const deleteProduct = useCallback((index) => {
    setAnimation({ index, type: "delete" });

    setTimeout(() => {
      setProducts((prev) => {
        const updatedProducts = prev.filter((_, i) => i !== index);
        return updatedProducts;
      });
      setActiveDropdownIndex(null);
    }, 500);
  }, []);

  const toggleDropdown = useCallback((index, e) => {
    if (e) e.stopPropagation();
    setActiveDropdownIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("userToken");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userSession");
      
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(lowercasedFilter) ||
          product.brandname?.toLowerCase().includes(lowercasedFilter) ||
          (product.partnersname &&
            product.partnersname.toLowerCase().includes(lowercasedFilter)) ||
          (product.color &&
            product.color.toLowerCase().includes(lowercasedFilter)) ||
          (product.price && product.price.toString().includes(lowercasedFilter))
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
        if (!a[sortConfig.key]) return 1;
        if (!b[sortConfig.key]) return -1;

        if (sortConfig.key === "price") {
          const priceA = parseFloat(a[sortConfig.key]);
          const priceB = parseFloat(b[sortConfig.key]);

          if (sortConfig.direction === "ascending") {
            return priceA - priceB;
          } else {
            return priceB - priceA;
          }
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [products, searchTerm, sortConfig]);

  return (
    <div className="min-h-screen bg-gray-100/10">
      <div className="flex flex-col sticky top-0 z-50">
        <NavBar onLogout={handleLogout} />
      </div>

      <div className="flex flex-col lg:flex-row gap-2 p-2 sm:p-3 lg:p-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden bg-white p-3 sm:p-4 rounded-lg shadow-md mb-2 flex items-center gap-2 hover:bg-gray-50 transition-colors active:scale-95"
          aria-label="Toggle sidebar"
        >
          <i
            className={`fa-solid ${
              isSidebarOpen ? "fa-times" : "fa-bars"
            } text-gray-700 text-lg`}
          ></i>
          <span className="text-gray-700 font-medium text-sm sm:text-base">
            {isSidebarOpen ? "Close Menu" : "Open Menu"}
          </span>
        </button>

        {/* Sidebar Container */}
        <div
          className={`
          ${isSidebarOpen ? "block" : "hidden"} 
          lg:block 
          w-full lg:w-auto 
          lg:flex-shrink-0
          transition-all duration-300 ease-in-out
          ${isMobile ? "fixed inset-0 z-50 bg-white" : ""}
        `}
        >
          <Leftsidebar
            onClose={closeSidebar}
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && isMobile && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeSidebar}
            aria-label="Close sidebar overlay"
          ></div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 w-full lg:w-auto min-w-0">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-md h-[calc(100vh-6rem)] flex flex-col">
            <div className="p-3 sm:p-4 lg:p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 gap-4 flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Product Management
              </h1>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 pl-8 sm:pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                    aria-label="Search products"
                  />
                  <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fa-solid fa-search text-sm"></i>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <i className="fa-solid fa-times text-sm"></i>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => openModal()}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto text-sm sm:text-base"
                  aria-label="Add new product"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Main content area with conditional scrolling */}
            <div className="flex-1 overflow-hidden">
              <div
                className="h-full overflow-y-auto p-3 sm:p-4 md:p-6"
                ref={containerRef}
              >
                {products.length === 0 ? (
                  <EmptyState onAddProduct={() => openModal()} />
                ) : (
                  <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {filteredAndSortedProducts.length > 0 ? (
                      filteredAndSortedProducts.map((item, index) => {
                        const originalIndex = products.findIndex(
                          (p) => p.id === item.id
                        );
                        const isAnimating = animation.index === originalIndex;

                        return (
                          <div
                            key={item.id || index}
                            className={`relative border border-gray-200 bg-white p-2 sm:p-3 flex flex-col gap-2 rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-lg shadow-sm ${
                              isAnimating && animation.type === "delete"
                                ? "animate-pulse bg-red-50 scale-95 opacity-50"
                                : isAnimating && animation.type === "update"
                                ? "animate-pulse bg-green-50"
                                : ""
                            }`}
                          >
                            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
                              <button
                                onClick={(e) =>
                                  toggleDropdown(originalIndex, e)
                                }
                                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Product actions"
                              >
                                <i className="fa-solid fa-ellipsis-vertical text-gray-500 text-sm sm:text-base"></i>
                              </button>

                              <ProductDropdown
                                isOpen={activeDropdownIndex === originalIndex}
                                onEdit={() => openModal(item, originalIndex)}
                                onDelete={() => deleteProduct(originalIndex)}
                                onClose={() => setActiveDropdownIndex(null)}
                                dropdownRef={dropdownRef}
                              />
                            </div>

                            <div
                              className="h-32 xs:h-45 sm:h-40 md:h-48 overflow-hidden rounded-lg cursor-pointer"
                            >
                              <img
                                src={item.image || "/api/placeholder/250/192"}
                                alt={item.name || "Product"}
                                className="h-full w-full object-cover hover:scale-105 transition-transform"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5 sm:gap-2 p-1 sm:p-2">
                              <div className="flex flex-col gap-1">
                                <span
                                  className="text-sm sm:text-base md:text-lg font-bold cursor-pointer hover:text-blue-600 transition-colors truncate"
                                  title={item.brandname}
                                >
                                  {item.brandname || item.title}
                                </span>

                                <span
                                  className="text-xs sm:text-sm text-gray-700 truncate"
                                  title={item.name}
                                >
                                  {item.name}
                                </span>

                                <p
                                  className="text-xs sm:text-sm text-gray-600 truncate"
                                  title={`${item.collectionname} ${
                                    item.color || ""
                                  }`}
                                >
                                  {item.collectionname &&
                                  item.collectionname.length >
                                    (window.innerWidth < 640 ? 15 : 25)
                                    ? item.collectionname.slice(
                                        0,
                                        window.innerWidth < 640 ? 15 : 25
                                      ) + "..."
                                    : item.collectionname}{" "}
                                  {item.color}
                                </p>

                                <div className="flex gap-0.5 sm:gap-1 text-xs sm:text-sm my-1">
                                  {[...Array(4)].map((_, i) => (
                                    <i
                                      key={i}
                                      className="fa-solid fa-star text-orange-500"
                                    ></i>
                                  ))}
                                  <i className="fa-regular fa-star text-orange-500"></i>
                                </div>

                                <p className="text-base sm:text-lg md:text-xl font-semibold cursor-pointer hover:text-blue-600 transition-colors">
                                  ₹ {item.price}
                                </p>
                              </div>

                              <button
                                className="hover:bg-green-700 bg-green-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md transition-colors font-medium text-sm sm:text-base mt-1 sm:mt-0"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center py-6 sm:py-8 text-gray-500 px-4">
                        <div className="mb-3 sm:mb-4">
                          <i className="fa-solid fa-search text-3xl sm:text-4xl text-gray-300"></i>
                        </div>
                        <p className="text-base sm:text-lg">
                          No products found matching your search criteria
                        </p>
                        <p className="text-sm text-gray-400 mt-1 sm:mt-2">
                          Try adjusting your search terms
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <ProductModal
            isOpen={isModalOpen}
            product={currentProduct}
            onClose={closeModal}
            onSave={handleSubmit}
            isEditing={editIndex !== null}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;