import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Leftsidebar from "./Leftsidebar";
import { image } from "../images";
import Product from "../Dashboard/Product-details";

// Separate components for better organization
const ProductDropdown = ({ isOpen, onEdit, onDelete, onClose, dropdownRef }) => {
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
    imageName: ""
  });
  
  // Get data from localStorage with error handling
  const getBrands = () => {
    try {
      return JSON.parse(localStorage.getItem("brand") || "[]");
    } catch (error) {
      console.error("Error parsing brands from localStorage:", error);
      return [];
    }
  };

  const getPartners = () => {
    try {
      return JSON.parse(localStorage.getItem("partners") || "[]");
    } catch (error) {
      console.error("Error parsing partners from localStorage:", error);
      return [];
    }
  };

  const getCollections = () => {
    try {
      return JSON.parse(localStorage.getItem("collection") || "[]");
    } catch (error) {
      console.error("Error parsing collections from localStorage:", error);
      return [];
    }
  };

  const brands = getBrands();
  const partners = getPartners();
  const collections = getCollections();
  
  const modalRef = useRef(null);

  // Initialize form data when modal opens or product changes
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
        imageName: product?.imageName || ""
      });
    }
  }, [isOpen, product]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format text inputs with capitalized words
    const formattedValue = name === "price" ? value : 
      value.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    
    let updatedProduct = { ...formData, [name]: formattedValue };

    // Reset dependent fields when brand changes
    if (name === "brandname") {
      updatedProduct.partnersname = "";
      updatedProduct.collectionname = "";
    }
    
    // Reset collection when partner changes
    if (name === "partnersname") {
      updatedProduct.collectionname = "";
    }

    setFormData(updatedProduct);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
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

  // Clear selected image
  const clearSelectedImage = () => {
    setFormData({ ...formData, image: "", imageName: "" });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.brandname || !formData.price || !formData.image) {
      alert("Please fill all required fields");
      return;
    }
    
    onSave(formData);
  };

  // Filter partners based on selected brand
  const filteredPartners = useMemo(() => {
    return partners.filter(partner => partner.brandname === formData.brandname);
  }, [partners, formData.brandname]);

  // Filter collections based on selected brand and partner
  const filteredCollections = useMemo(() => {
    return collections.filter(
      collection => 
        collection.brandname === formData.brandname && 
        collection.partnersname === formData.partnersname
    );
  }, [collections, formData.brandname, formData.partnersname]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
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
        
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Brand Name */}
          <div className="mb-4">
            <label htmlFor="brandSelect" className="block text-gray-700 font-medium mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <select
              id="brandSelect"
              name="brandname"
              value={formData.brandname}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              aria-required="true"
            >
              <option value="" disabled>Select Brand</option>
              {brands.map((brand, idx) => (
                <option key={idx} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Partners Name */}
          <div className="mb-4">
            <label htmlFor="partnerSelect" className="block text-gray-700 font-medium mb-2">
              Partner Name
            </label>
            <select
              id="partnerSelect"
              name="partnersname"
              value={formData.partnersname}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={!formData.brandname}
            >
              <option value="" disabled>Select Partner</option>
              {filteredPartners.map((partner, idx) => (
                <option key={idx} value={partner.name}>
                  {partner.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Collection Name */}
          <div className="mb-4">
            <label htmlFor="collectionSelect" className="block text-gray-700 font-medium mb-2">
              Collection Name
            </label>
            <select
              id="collectionSelect"
              name="collectionname"
              value={formData.collectionname}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={!formData.partnersname}
            >
              <option value="" disabled>Select Collection</option>
              {filteredCollections.map((collection, idx) => (
                <option key={idx} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Product Name */}
          <div className="mb-4">
            <label htmlFor="productName" className="block text-gray-700 font-medium mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              aria-required="true"
            />
          </div>
          
          {/* Color */}
          <div className="mb-4">
            <label htmlFor="colorInput" className="block text-gray-700 font-medium mb-2">
              Color
            </label>
            <input
              id="colorInput"
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Enter color"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          
          {/* Size */}
          <div className="mb-4">
            <label htmlFor="sizeSelect" className="block text-gray-700 font-medium mb-2">
              Size
            </label>
            <select
              id="sizeSelect"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="" disabled>Select Size</option>
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
          
          {/* Price */}
          <div className="mb-4">
            <label htmlFor="priceInput" className="block text-gray-700 font-medium mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="priceInput"
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              aria-required="true"
            />
          </div>
          
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Product Image <span className="text-red-500">*</span>
            </label>
            
            {!formData.image ? (
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required={!isEditing}
                aria-required={!isEditing}
              />
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
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || !formData.brandname || !formData.price || !formData.image}
              className={`px-4 py-2 rounded-lg ${
                formData.name.trim() && formData.brandname && formData.price && formData.image
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
  <div className="text-center py-12">
    <div className="mb-4">
      <img 
        src={image.dots}
        alt="No products" 
        className="w-16 h-16 mx-auto opacity-30"
      />
    </div>
    <p className="text-gray-500 text-lg mb-2">No products added yet.</p>
    <p className="text-gray-400 mb-4">Add your first product to get started</p>
    <button
      onClick={onAddProduct}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <i className="fa-solid fa-plus mr-2"></i>
      Add Your First Product
    </button>
  </div>
);

const Products = () => {
  // Navigation hook
  const navigate = useNavigate();

  // State management with localStorage
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [animation, setAnimation] = useState({ index: null, type: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig] = useState({ key: null, direction: 'ascending' });
  
  // Refs
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Load products from localStorage on component mount
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

  // Save products to localStorage whenever products state changes
  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products to localStorage:", error);
    }
  }, [products]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setCart([]);
    }
  }, []);

  // Save cart to localStorage whenever cart state changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownIndex(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Modal handlers
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

  // Fixed navigation function
  const viewProductDetails = (index) => {
    const selectedProduct = filteredAndSortedProducts[index];
    navigate("/product-detail", { state: selectedProduct });
  };

  // Form submission handler
  const handleSubmit = useCallback((formData) => {
    if (editIndex !== null) {
      // Update existing product with animation
      setAnimation({ index: editIndex, type: "update" });
      
      setTimeout(() => {
        setProducts(prev => 
          prev.map((product, i) => (i === editIndex ? { ...formData, id: product.id } : product))
        );
        
        setTimeout(() => {
          setAnimation({ index: null, type: null });
        }, 600);
      }, 300);
    } else {
      // Add new product
      const newId = products.length > 0 
        ? Math.max(...products.map(p => p.id || 0)) + 1 
        : 1;
      
      setProducts(prev => [...prev, { ...formData, id: newId }]);
    }
    
    closeModal();
  }, [editIndex, products, closeModal]);

  // Delete product with animation
  const deleteProduct = useCallback((index) => {
    setAnimation({ index, type: "delete" });
    
    setTimeout(() => {
      setProducts(prev => prev.filter((_, i) => i !== index));
      setActiveDropdownIndex(null);
    }, 500);
  }, []);

  // Cart handlers
  const handleAddToCart = useCallback((product) => {
    const existsInCart = cart.some(item => item.id === product.id);
    if (!existsInCart) {
      setCart(prev => [...prev, product]);
    }
  }, [cart]);

  const cartDetails = useCallback(() => {
    alert(`Cart has ${cart.length} items`);
  }, [cart]);

  // Toggle dropdown with improved event handling
  const toggleDropdown = useCallback((index, e) => {
    if (e) e.stopPropagation();
    setActiveDropdownIndex(prev => prev === index ? null : index);
  }, []);

  // Apply sorting and filtering with memo for performance
  const filteredAndSortedProducts = useMemo(() => {
    // First apply search filter
    let result = [...products];
    
    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowercasedFilter) || 
        product.brandname.toLowerCase().includes(lowercasedFilter) ||
        (product.partnersname && product.partnersname.toLowerCase().includes(lowercasedFilter)) ||
        (product.color && product.color.toLowerCase().includes(lowercasedFilter)) ||
        (product.price && product.price.toString().includes(lowercasedFilter))
      );
    }
    
    // Then apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Handle null values
        if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
        if (!a[sortConfig.key]) return 1;
        if (!b[sortConfig.key]) return -1;
        
        // Special handling for price (numeric sorting)
        if (sortConfig.key === 'price') {
          const priceA = parseFloat(a[sortConfig.key]);
          const priceB = parseFloat(b[sortConfig.key]);
          
          if (sortConfig.direction === 'ascending') {
            return priceA - priceB;
          } else {
            return priceB - priceA;
          }
        }
        
        // String comparison for other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [products, searchTerm, sortConfig]);

  return (
    <div className="min-h-screen bg-gray-200">
      <NavBar />
      <div className="flex mx-4 mt-4 gap-3">
        <Leftsidebar />
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-md h-[calc(100vh-6rem)] flex flex-col">
            {/* Header with Add Product button and search */}
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 gap-4 flex-shrink-0">
              <h1 className="text-2xl font-semibold text-gray-800">Product Management</h1>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Search box */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    aria-label="Search products"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fa-solid fa-search"></i>
                  </div>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  )}
                </div>
                
                {/* Add product button */}
                <button
                  onClick={() => openModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  aria-label="Add new product"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Main content area with conditional scrolling */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-6" ref={containerRef}>
                {products.length === 0 ? (
                  <EmptyState onAddProduct={() => openModal()} />
                ) : (
                  // Grid view for products
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedProducts.length > 0 ? (
                      filteredAndSortedProducts.map((item, index) => {
                        const originalIndex = products.findIndex(p => p.id === item.id);
                        const existsInCart = cart.some((cartItem) => cartItem.id === item.id);
                        const isAnimating = animation.index === originalIndex;

                        return (
                          <div
                            key={item.id || index}
                            className={`relative border border-gray-300 bg-white p-3 flex flex-col gap-2 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                              isAnimating && animation.type === "delete" 
                                ? "animate-pulse bg-red-50 scale-95 opacity-50" 
                                : isAnimating && animation.type === "update"
                                ? "animate-pulse bg-green-50"
                                : ""
                            }`}
                          >
                            {/* Action dropdown */}
                            <div className="absolute top-2 right-2 z-10">
                              <button
                                onClick={(e) => toggleDropdown(originalIndex, e)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Product actions"
                              >
                                <i className="fa-solid fa-ellipsis-vertical text-gray-500"></i>
                              </button>
                              
                              <ProductDropdown
                                isOpen={activeDropdownIndex === originalIndex}
                                onEdit={() => openModal(item, originalIndex)}
                                onDelete={() => deleteProduct(originalIndex)}
                                onClose={() => setActiveDropdownIndex(null)}
                                dropdownRef={dropdownRef}
                              />
                            </div>

                            {/* Product image */}
                            <div className="h-48 overflow-hidden rounded-lg">
                              <img
                                src={item.image || "/api/placeholder/250/192"}
                                alt={item.name || "Product"}
                                className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform"
                              />
                            </div>

                            {/* Product details */}
                            <div className="flex flex-col gap-2 p-2">
                              <div className="flex flex-col">
                                <span
                                  className="text-lg font-bold cursor-pointer hover:text-blue-600 transition-colors truncate"
                                  title={item.brandname}
                                >
                                  {item.brandname}
                                </span>
                                
                                <p className="text-sm text-gray-600 truncate" title={`${item.collectionname || ''} ${item.color || ''}`}>
                                  {item.collectionname && item.collectionname.length > 25
                                    ? item.collectionname.slice(0, 25) + "..."
                                    : item.collectionname}{" "}
                                  {item.color}
                                </p>

                                {/* Star rating */}
                                <div className="flex gap-1 text-sm my-1">
                                  {[...Array(4)].map((_, i) => (
                                    <i key={i} className="fa-solid fa-star text-orange-500"></i>
                                  ))}
                                  <i className="fa-regular fa-star text-orange-500"></i>
                                </div>

                                <p
                                  className="text-xl font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                  ₹ {item.price}
                                </p>
                              </div>

                              {/* Action button */}
                              <button
                                className="hover:bg-green-700 bg-green-600 text-white py-2 px-4 rounded-md transition-colors font-medium"
                                onClick={() => viewProductDetails(index)}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <div className="mb-4">
                          <i className="fa-solid fa-search text-4xl text-gray-300"></i>
                        </div>
                        <p className="text-lg">No products found matching your search criteria</p>
                        <p className="text-sm text-gray-400 mt-2">Try adjusting your search terms</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={currentProduct}
        onClose={closeModal}
        onSave={handleSubmit}
        isEditing={editIndex !== null}
      />
    </div>
  );
};

export default Products;  