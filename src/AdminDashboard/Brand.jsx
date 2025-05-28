import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import NavBar from "./NavBar";
import Leftsidebar from "./Leftsidebar";
import { image } from "../images";

// Separate components for better organization
const BrandDropdown = ({ isOpen, onEdit, onDelete, onClose, dropdownRef }) => {
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

const BrandModal = ({ isOpen, brand, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState({ name: "" });
  const modalRef = useRef(null);

  // Initialize form data when modal opens or brand changes
  useEffect(() => {
    if (isOpen) {
      setFormData({ 
        name: brand?.name || "" 
      });
    }
  }, [isOpen, brand]);

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
    setFormData({
      ...formData,
      [name]: value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Brand" : "Add New Brand"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <img src={image.remove} alt="Close" width="20" height="20" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="brandName" className="block text-gray-700 font-medium mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              id="brandName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter brand name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              aria-required="true"
            />
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
              disabled={!formData.name.trim()}
              className={`px-4 py-2 rounded-lg ${
                formData.name.trim()
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

const EmptyState = ({ onAddBrand }) => (
  <div className="text-center py-12">
    <div className="mb-4">
      <img 
        src={image.dots} 
        alt="No brands" 
        className="w-16 h-16 mx-auto opacity-30"
      />
    </div>
    <p className="text-gray-500 text-lg mb-2">No brands added yet.</p>
    <p className="text-gray-400 mb-4">Add your first brand to get started</p>
    <button
      onClick={onAddBrand}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <i className="fa-solid fa-plus mr-2"></i>
      Add Your First Brand
    </button>
  </div>
);

const BrandRow = ({ brand, originalIndex, isAnimating, animationType, onToggleDropdown, isDropdownOpen, dropdownRef, onEdit, onDelete }) => (
  <tr 
    className={`border-b border-gray-200 font-[18px] relative ${
      isAnimating && animationType === 'delete' 
        ? 'animate-slide-out-right opacity-0' 
        : isAnimating && animationType === 'update'
        ? 'animate-pulse bg-blue-50'
        : 'hover:bg-gray-50'
    } transition-all duration-300`}
  >
    <td className="px-6 py-3 w-3/4">
      <div className="truncate max-w-full" title={brand.name}>
        {brand.name}
      </div>
    </td>
    <td className="px-6 py-3 w-1/4">
      <div className="flex justify-center">
        <div className="relative" ref={isDropdownOpen ? dropdownRef : null}>
          <button
            onClick={(e) => onToggleDropdown(e)}
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
            aria-label="More options"
            aria-expanded={isDropdownOpen}
          >
            <img src={image.dots} alt="More options" width="20" height="24" />
          </button>
          
          <BrandDropdown 
            isOpen={isDropdownOpen}
            onEdit={() => onEdit(brand, originalIndex)}
            onDelete={() => onDelete(originalIndex)}
            onClose={() => onToggleDropdown()}
            dropdownRef={dropdownRef}
          />
        </div>
      </div>
    </td>
  </tr>
);

const Brand = () => {
  // State management
  const [brands, setBrands] = useState(() => {
    try {
      const item = localStorage.getItem("brand");
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [animation, setAnimation] = useState({ index: null, type: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig] = useState({ key: 'name', direction: 'ascending' });
  
  // Refs
  const dropdownRef = useRef(null);
  const tableRef = useRef(null);

  // Save to localStorage whenever brands change
  useEffect(() => {
    try {
      localStorage.setItem("brand", JSON.stringify(brands));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [brands]);

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
  const openModal = useCallback((brandToEdit = null, index = null) => {
    setCurrentBrand(brandToEdit);
    setEditIndex(index);
    setIsModalOpen(true);
    setActiveDropdownIndex(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentBrand(null);
    setEditIndex(null);
  }, []);

  // Form submission handler
  const handleSubmit = useCallback((formData) => {
    if (!formData.name.trim()) {
      return;
    }

    if (editIndex !== null) {
      // Update existing brand with animation
      setAnimation({ index: editIndex, type: "update" });
      
      setTimeout(() => {
        setBrands(prev => 
          prev.map((brand, i) => (i === editIndex ? formData : brand))
        );
        
        setTimeout(() => {
          setAnimation({ index: null, type: null });
        }, 600);
      }, 300);
    } else {
      // Add new brand
      setBrands(prev => [...prev, formData]);
    }
    
    closeModal();
  }, [editIndex, closeModal]);

  // Delete brand with animation
  const deleteBrand = useCallback((index) => {
    setAnimation({ index, type: "delete" });
    
    setTimeout(() => {
      setBrands(prev => prev.filter((_, i) => i !== index));
      setActiveDropdownIndex(null);
      setAnimation({ index: null, type: null });
    }, 500);
  }, []);

  // Toggle dropdown with improved event handling
  const toggleDropdown = useCallback((index, e) => {
    if (e) e.stopPropagation();
    setActiveDropdownIndex(prev => prev === index ? null : index);
  }, []);

  // Apply sorting and filtering with memo for performance
  const filteredAndSortedBrands = useMemo(() => {
    // First apply search filter
    let result = [...brands];
    
    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(brand => 
        brand.name.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    // Then apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
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
  }, [brands, searchTerm, sortConfig]);

  return (
    <div className="min-h-screen bg-gray-200">
      <NavBar />
      <div className="flex m-4 gap-3">
        <Leftsidebar />
        <div className="flex-1">
          <div className="bg-white rounded-2xl h-[calc(100vh-6rem)] shadow-md">
            {/* Header with Add Brand button and search */}
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">Brand Management</h1>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Search box */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    aria-label="Search brands"
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
                
                {/* Add brand button */}
                <button
                  onClick={() => openModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  aria-label="Add new brand"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Add Brand</span>
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="py-2 px-6">
              {filteredAndSortedBrands.length === 0 ? (
                searchTerm ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No results found for "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Clear search
                    </button>
                  </div>
                ) : brands.length === 0 ? (
                  <EmptyState onAddBrand={() => openModal()} />
                ) : null
              ) : (
                <div className="overflow-hidden flex flex-col">
                  {/* Fixed table header */}
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200 border-b border-gray-300">
                        <th className="px-6 py-3 text-left font-semibold w-3/4">
                          Brand Name
                        </th>
                        <th className="px-6 py-3 text-center font-semibold w-1/4">Actions</th>
                      </tr>
                    </thead>
                  </table>
                  
                  {/* Scrollable table body */}
                  <div 
                    ref={tableRef}
                    className="overflow-y-auto overflow-x-hidden scrollbar-thin" 
                    style={{ maxHeight: "calc(100vh - 290px)" }}
                  >
                    <table className="w-full border-collapse">
                      <tbody>
                        {filteredAndSortedBrands.map((brand, displayIndex) => {
                          // Find the original index in the full brands array
                          const originalIndex = brands.findIndex(b => b.name === brand.name);
                          return (
                            <BrandRow
                              key={`${originalIndex}-${brand.name}`}
                              brand={brand}
                              originalIndex={originalIndex}
                              isAnimating={animation.index === originalIndex}
                              animationType={animation.type}
                              onToggleDropdown={(e) => toggleDropdown(originalIndex, e)}
                              isDropdownOpen={activeDropdownIndex === originalIndex}
                              dropdownRef={dropdownRef}
                              onEdit={openModal}
                              onDelete={deleteBrand}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Brand count */}
                  <div className="flex justify-between items-center py-3 px-6 border-t border-gray-200 text-sm text-gray-500">
                    <div>
                      {searchTerm 
                        ? `${filteredAndSortedBrands.length} of ${brands.length} brands`
                        : `${brands.length} brand${brands.length !== 1 ? 's' : ''}`
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding/editing brand */}
      <BrandModal
        isOpen={isModalOpen}
        brands={currentBrand}
        onClose={closeModal}
        onSave={handleSubmit}
        isEditing={editIndex !== null}
      />

      {/* Add these animation classes to your global CSS */}
      <style jsx>{`
        @keyframes slide-out-right {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes dropdown-appear {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-slide-out-right {
          animation: slide-out-right 0.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        .animate-dropdown {
          animation: dropdown-appear 0.25s ease-out forwards;
        }
        
        /* Custom scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Brand;