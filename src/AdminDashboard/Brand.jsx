import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import NavBar from "./NavBar";
import Leftsidebar from "./Leftsidebar";
import { image } from "../images";

// Memoized BrandDropdown component
const BrandDropdown = React.memo(({ isOpen, onEdit, onDelete, onClose, dropdownRef }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      ref={dropdownRef} 
      className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-20 py-1 min-w-32 md:min-w-44 border border-gray-200 animate-dropdown"
    >
      <button
        onClick={onEdit}
        className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 text-gray-700 hover:bg-blue-50 w-full text-left transition-colors group text-sm md:text-base"
        aria-label="Edit brand"
      >
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <i className="fa-solid fa-pen-to-square text-blue-500 text-xs md:text-sm"></i>
        </div>
        <span className="font-medium">Edit</span>
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 text-gray-700 hover:bg-red-50 w-full text-left transition-colors group text-sm md:text-base"
        aria-label="Delete brand"
      >
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
          <i className="fa-solid fa-trash text-red-500 text-xs md:text-sm"></i>
        </div>
        <span className="font-medium">Delete</span>
      </button>
    </div>
  );
});

// Memoized BrandModal component
const BrandModal = React.memo(({ isOpen, brand, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState({ name: "" });
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ 
        name: brand?.name || "" 
      });
    }
  }, [isOpen, brand]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Brand" : "Add New Brand"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-times text-gray-500 text-lg"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter brand name"
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
              aria-required="true"
            />
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Memoized EmptyState component
const EmptyState = React.memo(({ onAddBrand }) => (
  <div className="text-center py-8 md:py-12 px-4">
    <div className="mb-4">
      <i className="fa-solid fa-tag text-4xl md:text-6xl text-gray-300 mb-4"></i>
    </div>
    <p className="text-gray-500 text-base md:text-lg mb-2">No brands added yet.</p>
    <p className="text-gray-400 mb-4 text-sm md:text-base">Add your first brand to get started</p>
    <button
      onClick={onAddBrand}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
      aria-label="Add first brand"
    >
      <i className="fa-solid fa-plus mr-2"></i>
      Add Your First Brand
    </button>
  </div>
));

// Memoized BrandRow component
const BrandRow = React.memo(({ brand, originalIndex, isAnimating, animationType, onToggleDropdown, isDropdownOpen, dropdownRef, onEdit, onDelete }) => (
  <tr 
    className={`border-b border-gray-200 relative ${
      isAnimating && animationType === 'delete' 
        ? 'animate-slide-out-right opacity-0' 
        : isAnimating && animationType === 'update'
        ? 'animate-pulse bg-blue-50'
        : 'hover:bg-gray-50'
    } transition-all duration-300`}
  >
    <td className="px-3 md:px-6 py-3 w-3/4">
      <div className="truncate max-w-full text-sm md:text-base" title={brand.name}>
        {brand.name}
      </div>
    </td>
    <td className="px-3 md:px-6 py-3 w-1/4">
      <div className="flex justify-center">
        <div className="relative" ref={isDropdownOpen ? dropdownRef : null}>
          <button
            onClick={(e) => onToggleDropdown(e)}
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
            aria-label="More options"
            aria-expanded={isDropdownOpen}
          >
            <i className="fa-solid fa-ellipsis-vertical text-gray-500 text-sm md:text-base"></i>
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
));

// Memoized BrandCard component
const BrandCard = React.memo(({ brand, originalIndex, isAnimating, animationType, onToggleDropdown, isDropdownOpen, dropdownRef, onEdit, onDelete }) => (
  <div 
    className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 ${
      isAnimating && animationType === 'delete' 
        ? 'animate-slide-out-right opacity-0' 
        : isAnimating && animationType === 'update'
        ? 'animate-pulse bg-blue-50'
        : ''
    } transition-all duration-300`}
  >
    <div className="flex justify-between items-center">
      <div className="flex-1 mr-3">
        <h3 className="font-medium text-gray-800 truncate" title={brand.name}>
          {brand.name}
        </h3>
      </div>
      <div className="relative" ref={isDropdownOpen ? dropdownRef : null}>
        <button
          onClick={(e) => onToggleDropdown(e)}
          className="hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="More options"
          aria-expanded={isDropdownOpen}
        >
          <i className="fa-solid fa-ellipsis-vertical text-gray-500 text-base"></i>
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
  </div>
));

const Brand = () => {
  const [brands, setBrands] = useState([
    { name: "Nike" },
    { name: "Adidas" },
    { name: "Puma" },
    { name: "Reebok" },
    { name: "Under Armour" }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [animation, setAnimation] = useState({ index: null, type: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileSize = window.innerWidth < 1024;
      setIsMobile(isMobileSize);
      if (isMobileSize) {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

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

  const handleSubmit = useCallback((formData) => {
    if (!formData.name.trim()) return;

    if (editIndex !== null) {
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
      setBrands(prev => [...prev, formData]);
    }
    
    closeModal();
  }, [editIndex, closeModal]);

  const deleteBrand = useCallback((index) => {
    setAnimation({ index, type: "delete" });
    
    setTimeout(() => {
      setBrands(prev => prev.filter((_, i) => i !== index));
      setActiveDropdownIndex(null);
      setAnimation({ index: null, type: null });
    }, 500);
  }, []);

  const toggleDropdown = useCallback((index, e) => {
    if (e) e.stopPropagation();
    setActiveDropdownIndex(prev => prev === index ? null : index);
  }, []);

  const filteredAndSortedBrands = useMemo(() => {
    let result = [...brands];
    
    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(brand => 
        brand.name.toLowerCase().includes(lowercasedFilter))
    }
    
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
    <>
    <div className="min-h-screen bg-gray-100/10">
      <NavBar />
      
      <div className="flex flex-col lg:flex-row gap-2 p-2 sm:p-3 lg:p-4">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden bg-white p-3 sm:p-4 rounded-lg shadow-md mb-2 flex items-center gap-2 hover:bg-gray-50 transition-colors active:scale-95"
          aria-label="Toggle sidebar"
        >
          <i className={`fa-solid ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-gray-700 text-lg`}></i>
          <span className="text-gray-700 font-medium text-sm sm:text-base">
            {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
          </span>
        </button>

        {/* Sidebar Container */}
        <div className={`
          ${isSidebarOpen ? 'block' : 'hidden'} 
          lg:block 
          w-full lg:w-auto 
          lg:flex-shrink-0
          transition-all duration-300 ease-in-out
          ${isMobile ? 'fixed inset-0 z-50 bg-white' : ''}
        `}>
          <Leftsidebar 
            onClose={closeSidebar} 
            isMobile={isMobile}
            isOpen={isSidebarOpen}
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
          <div className="bg-white rounded-xl lg:rounded-2xl min-h-[calc(100vh-6rem)] shadow-lg">
            {/* Header with Add Brand button and search */}
            <div className="p-4 md:p-6 flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 border-b border-gray-200">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Brand Management</h1>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
                {/* Search box */}
                <div className="relative w-full sm:flex-1 lg:w-64">
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 pl-8 md:pl-10 pr-8 md:pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base"
                    aria-label="Search brands"
                  />
                  <div className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fa-solid fa-search text-sm"></i>
                  </div>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <i className="fa-solid fa-times text-sm"></i>
                    </button>
                  )}
                </div>
                
                {/* Add brand button */}
                <button
                  onClick={() => openModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto text-sm md:text-base"
                  aria-label="Add new brand"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span className="hidden sm:inline">Add Brand</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="py-2 px-4 md:px-6">
              {filteredAndSortedBrands.length === 0 ? (
                searchTerm ? (
                  <div className="text-center py-8 md:py-12">
                    <p className="text-gray-500 text-base md:text-lg">No results found for "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors text-sm md:text-base"
                    >
                      Clear search
                    </button>
                  </div>
                ) : brands.length === 0 ? (
                  <EmptyState onAddBrand={() => openModal()} />
                ) : null
              ) : (
                <div className="overflow-hidden flex flex-col">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    {/* Fixed table header */}
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-3 text-left font-semibold text-gray-700 w-3/4 text-sm md:text-base">
                            Brand Name
                          </th>
                          <th className="px-6 py-3 text-center font-semibold text-gray-700 w-1/4 text-sm md:text-base">Actions</th>
                        </tr>
                      </thead>
                    </table>
                    
                    {/* Scrollable table body */}
                    <div 
                      ref={tableRef}
                      className="overflow-y-auto overflow-x-hidden scrollbar-thin max-h-96"
                    >
                      <table className="w-full border-collapse">
                        <tbody>
                          {filteredAndSortedBrands.map((brand, displayIndex) => {
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
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden">
                    <div className="overflow-y-auto scrollbar-thin max-h-96">
                      {filteredAndSortedBrands.map((brand, displayIndex) => {
                        const originalIndex = brands.findIndex(b => b.name === brand.name);
                        return (
                          <BrandCard
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
                    </div>
                  </div>
                  
                  {/* Brand count */}
                  <div className="flex justify-between items-center py-3 px-4 md:px-6 border-t border-gray-200 text-xs md:text-sm text-gray-500">
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
        brand={currentBrand}
        onClose={closeModal}
        onSave={handleSubmit}
        isEditing={editIndex !== null}
      />

      {/* Styles */}
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
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Responsive breakpoints adjustments */
        @media (max-width: 640px) {
          .min-w-0 {
            min-width: 0;
          }
        }
      `}</style>
      </div>
      </>
  );
};

export default Brand;
