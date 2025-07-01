import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import NavBar from "./NavBar";
import Leftsidebar from "./Leftsidebar";

const PartnerModal = React.memo(({ isOpen, partner, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState({ name: "", brandname: "" });
  const [brands, setBrands] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const storedBrands = JSON.parse(localStorage.getItem("brand")) || [];
    setBrands(storedBrands);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({ 
        name: partner?.name || "",
        brandname: partner?.brandname || ""
      });
    }
  }, [isOpen, partner]);

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
      [name]: name === "name" ? value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brandname) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Partner" : "Add New Partner"}
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
            <select
              name="brandname"
              value={formData.brandname}
              onChange={handleInputChange}
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base"
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

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
              Partner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter partner name"
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
              disabled={!formData.name.trim() || !formData.brandname}
              className={`px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                formData.name.trim() && formData.brandname
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "bg-blue-300 text-white cursor-not-allowed"
              }`}
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

const EmptyState = React.memo(({ onAddPartner }) => (
  <div className="text-center py-8 md:py-12 px-4">
    <div className="mb-4">
      <i className="fa-solid fa-handshake text-4xl md:text-6xl text-gray-300 mb-4"></i>
    </div>
    <p className="text-gray-500 text-base md:text-lg mb-2">No partners added yet.</p>
    <p className="text-gray-400 mb-4 text-sm md:text-base">Add your first partner to get started</p>
    <button
      onClick={onAddPartner}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
      aria-label="Add first partner"
    >
      <i className="fa-solid fa-plus mr-2"></i>
      Add Your First Partner
    </button>
  </div>
));

const PartnerRow = React.memo(({ partner, originalIndex, isAnimating, animationType, onEdit, onDelete }) => (
  <tr 
    className={`border-b border-gray-200 ${
      isAnimating && animationType === 'delete' 
        ? 'animate-slide-out-right opacity-0' 
        : isAnimating && animationType === 'update'
        ? 'animate-pulse bg-blue-50'
        : 'hover:bg-gray-50'
    } transition-all duration-300`}
  >
    <td className="px-3 md:px-6 py-4 w-2/5">
      <div className="truncate max-w-full text-sm md:text-base font-medium text-gray-800" title={partner.brandname}>
        {partner.brandname}
      </div>
    </td>
    <td className="px-3 md:px-6 py-4 w-2/5">
      <div className="truncate max-w-full text-sm md:text-base font-medium text-gray-800" title={partner.name}>
        {partner.name}
      </div>
    </td>
    <td className="px-3 md:px-6 py-4 w-1/5">
      <div className="flex justify-center gap-3">
        <button
          onClick={() => onEdit(partner, originalIndex)}
          className="inline-flex items-center px-3 py-2 border border-blue-300 bg-blue-50 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm"
          aria-label="Edit partner"
        >
          <i className="fa-solid fa-pen-to-square text-xs mr-1.5"></i>
          <span className="hidden sm:inline">Edit</span>
        </button>
        
        <button
          onClick={() => onDelete(originalIndex)}
          className="inline-flex items-center px-3 py-2 border border-red-300 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 shadow-sm"
          aria-label="Delete partner"
        >
          <i className="fa-solid fa-trash text-xs mr-1.5"></i>
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </td>
  </tr>
));

const PartnerCard = React.memo(({ partner, originalIndex, isAnimating, animationType, onEdit, onDelete }) => (
  <div 
    className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm ${
      isAnimating && animationType === 'delete' 
        ? 'animate-slide-out-right opacity-0' 
        : isAnimating && animationType === 'update'
        ? 'animate-pulse bg-blue-50'
        : 'hover:shadow-md'
    } transition-all duration-300`}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1 mr-4">
        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-1">Brand Name</p>
          <h3 className="font-semibold text-gray-800 truncate text-base" title={partner.brandname}>
            {partner.brandname}
          </h3>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Partner Name</p>
          <h4 className="font-semibold text-gray-800 truncate text-base" title={partner.name}>
            {partner.name}
          </h4>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(partner, originalIndex)}
          className="inline-flex items-center px-3 py-2 border border-blue-300 bg-blue-50 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm"
          aria-label="Edit partner"
        >
          <i className="fa-solid fa-pen-to-square text-xs mr-1.5"></i>
          <span>Edit</span>
        </button>
        
        <button
          onClick={() => onDelete(originalIndex)}
          className="inline-flex items-center px-3 py-2 border border-red-300 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 shadow-sm"
          aria-label="Delete partner"
        >
          <i className="fa-solid fa-trash text-xs mr-1.5"></i>
          <span>Delete</span>
        </button>
      </div>
    </div>
  </div>
));

const Partners = () => {
  const [partners, setPartners] = useState(() => {
    return JSON.parse(localStorage.getItem("partners")) || [];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [animation, setAnimation] = useState({ index: null, type: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const tableRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("partners", JSON.stringify(partners));
  }, [partners]);

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

  const openModal = useCallback((partnerToEdit = null, index = null) => {
    setCurrentPartner(partnerToEdit);
    setEditIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentPartner(null);
    setEditIndex(null);
  }, []);

  const handleSubmit = useCallback((formData) => {
    if (!formData.name.trim() || !formData.brandname) return;

    if (editIndex !== null) {
      setAnimation({ index: editIndex, type: "update" });
      
      setTimeout(() => {
        setPartners(prev => 
          prev.map((partner, i) => (i === editIndex ? formData : partner))
        );
        
        setTimeout(() => {
          setAnimation({ index: null, type: null });
        }, 600);
      }, 300);
    } else {
      setPartners(prev => [...prev, formData]);
    }
    
    closeModal();
  }, [editIndex, closeModal]);

  const deletePartner = useCallback((index) => {
    setAnimation({ index, type: "delete" });
    
    setTimeout(() => {
      setPartners(prev => prev.filter((_, i) => i !== index));
      setAnimation({ index: null, type: null });
    }, 500);
  }, []);

  const filteredAndSortedPartners = useMemo(() => {
    let result = [...partners];
    
    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(partner => 
        partner.name.toLowerCase().includes(lowercasedFilter) ||
        partner.brandname.toLowerCase().includes(lowercasedFilter)
      );
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
  }, [partners, searchTerm, sortConfig]);

  return (
    <>
    <div className="min-h-screen bg-gray-100/10">
      <div className="flex flex-col sticky top-0 z-50">
        <NavBar />
      </div>
      
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
            {partners.length > 0 && (
              <div className="p-4 md:p-6 flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 border-b border-gray-200">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Partner Management</h1>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
                  <div className="relative w-full sm:flex-1 lg:w-64">
                    <input
                      type="text"
                      placeholder="Search partners..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 pl-8 md:pl-10 pr-8 md:pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base"
                      aria-label="Search partners"
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
                  
                  {/* Add partner button */}
                  <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto text-sm md:text-base shadow-sm"
                    aria-label="Add new partner"
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span className="hidden sm:inline">Add Partner</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Content area */}
            <div className="py-2 px-4 md:px-6">
              {filteredAndSortedPartners.length === 0 ? (
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
                ) : partners.length === 0 ? (
                  <EmptyState onAddPartner={() => openModal()} />
                ) : null
              ) : (
                <div className="overflow-hidden flex flex-col">
                  <div className="hidden md:block">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 w-2/5 text-sm md:text-base">
                            Brand Name
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 w-2/5 text-sm md:text-base">
                            Partner Name
                          </th>
                          <th className="px-6 py-4 text-center font-semibold text-gray-700 w-1/5 text-sm md:text-base">Actions</th>
                        </tr>
                      </thead>
                    </table>
                    
                    <div 
                      ref={tableRef}
                      className="overflow-y-auto overflow-x-hidden scrollbar-thin max-h-96"
                    >
                      <table className="w-full border-collapse">
                        <tbody>
                          {filteredAndSortedPartners.map((partner, displayIndex) => {
                            const originalIndex = partners.findIndex(p => p.name === partner.name && p.brandname === partner.brandname);
                            return (
                              <PartnerRow
                                key={`${originalIndex}-${partner.name}-${partner.brandname}`}
                                partner={partner}
                                originalIndex={originalIndex}
                                isAnimating={animation.index === originalIndex}
                                animationType={animation.type}
                                onEdit={openModal}
                                onDelete={deletePartner}
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
                      {filteredAndSortedPartners.map((partner, displayIndex) => {
                        const originalIndex = partners.findIndex(p => p.name === partner.name && p.brandname === partner.brandname);
                        return (
                          <PartnerCard
                            key={`${originalIndex}-${partner.name}-${partner.brandname}`}
                            partner={partner}
                            originalIndex={originalIndex}
                            isAnimating={animation.index === originalIndex}
                            animationType={animation.type}
                            onEdit={openModal}
                            onDelete={deletePartner}
                          />
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Partner count */}
                  <div className="flex justify-between items-center py-3 px-4 md:px-6 border-t border-gray-200 text-xs md:text-sm text-gray-500">
                    <div>
                      {searchTerm 
                        ? `${filteredAndSortedPartners.length} of ${partners.length} partners`
                        : `${partners.length} partner${partners.length !== 1 ? 's' : ''}`
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding/editing partner */}
      <PartnerModal
        isOpen={isModalOpen}
        partner={currentPartner}
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
          width:0;
          overflow-y :hidden;
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

export default Partners;
