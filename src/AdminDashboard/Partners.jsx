import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import NavBar from "./NavBar";
import Leftsidebar from "./Leftsidebar";
import { image } from "../images";

// Separate components for better organization
const PartnerDropdown = ({ isOpen, onEdit, onDelete, onClose, dropdownRef }) => {
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

const PartnerModal = ({ isOpen, partner, brands, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState({ name: "", brandname: "" });
  const modalRef = useRef(null);

  const [brand, setBrand] = useState(() => {
    return JSON.parse(localStorage.getItem("brand")) || [];
  });

  // Initialize form data when modal opens or partner changes
  useEffect(() => {
    if (isOpen) {
      setFormData({ 
        name: partner?.name || "", 
        brandname: partner?.brandname || "" 
      });
    }
  }, [isOpen, partner]);

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
      [name]: name === "brandname" ? value : value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brandname) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Partner" : "Add New Partner"}
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
              {brand.map((brand, idx) => (
                <option key={idx} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="partnerName" className="block text-gray-700 font-medium mb-2">
              Partner Name <span className="text-red-500">*</span>
            </label>
            <input
              id="partnerName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter partner name"
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
              disabled={!formData.name.trim() || !formData.brandname}
              className={`px-4 py-2 rounded-lg ${
                formData.name.trim() && formData.brandname
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

const EmptyState = ({ onAddPartner }) => (
  <div className="text-center py-12">
    <div className="mb-4">
      <img 
        src={image.dots}
        alt="No partners" 
        className="w-16 h-16 mx-auto opacity-30"
      />
    </div>
    <p className="text-gray-500 text-lg mb-2">No partners added yet.</p>
    <p className="text-gray-400 mb-4">Add your first partner to get started</p>
    <button
      onClick={onAddPartner}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <i className="fa-solid fa-plus mr-2"></i>
      Add Your First Partner
    </button>
  </div>
);

const PartnerRow = ({ partner, index, isAnimating, animationType, onToggleDropdown, isDropdownOpen, dropdownRef, onEdit, onDelete }) => (
  <tr 
    className={`border-b border-gray-200 font-[18px] relative ${
      isAnimating && animationType === 'delete' 
        ? 'animate-slide-out-right opacity-0' 
        : isAnimating && animationType === 'update'
        ? 'animate-pulse bg-blue-50'
        : 'hover:bg-gray-50'
    } transition-all duration-300`}
  >
    <td className="px-6 py-3 w-2/5">
      <div className="truncate max-w-full" title={partner.brandname}>
        {partner.brandname}
      </div>
    </td>
    <td className="px-6 py-3 w-2/5">
      <div className="truncate max-w-full" title={partner.name}>
        {partner.name}
      </div>
    </td>
    <td className="px-6 py-3 w-1/5">
      <div className="flex justify-center">
        <div className="relative" ref={isDropdownOpen ? dropdownRef : null}>
          <button
            onClick={(e) => onToggleDropdown(index, e)}
            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
            aria-label="More options"
            aria-expanded={isDropdownOpen}
          >
            <img src={image.dots} alt="More options" width="20" height="24" />
          </button>
          
          <PartnerDropdown 
            isOpen={isDropdownOpen}
            onEdit={() => onEdit(partner, index)}
            onDelete={() => onDelete(index)}
            onClose={() => onToggleDropdown(null)}
            dropdownRef={dropdownRef}
          />
        </div>
      </div>
    </td>
  </tr>
);

const Partners = () => {
  const [partners, setPartners] = useState(() => {
    return JSON.parse(localStorage.getItem("partners")) || [];  
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [animation, setAnimation] = useState({ index: null, type: null });
  const [searchTerm, setSearchTerm] = useState("");
  
  // Refs
  const dropdownRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("partners", JSON.stringify(partners));
  }, [partners]);

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
  const openModal = useCallback((partnerToEdit = null, index = null) => {
    setCurrentPartner(partnerToEdit);
    setEditIndex(index);
    setIsModalOpen(true);
    setActiveDropdownIndex(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentPartner(null);
    setEditIndex(null);
  }, []);

  // Form submission handler
  const handleSubmit = useCallback((formData) => {
    if (!formData.name.trim() || !formData.brandname) {
      return;
    }

    if (editIndex !== null) {
      // Update existing partner with animation
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
      // Add new partner
      setPartners(prev => [...prev, formData]);
    }
    
    closeModal();
  }, [editIndex, closeModal]);

  // Delete partner with animation - FIXED
  const deletePartner = useCallback((index) => {
    setAnimation({ index, type: "delete" });
    setActiveDropdownIndex(null);
    
    setTimeout(() => {
      setPartners(prev => prev.filter((_, i) => i !== index));
      setAnimation({ index: null, type: null });
    }, 500);
  }, []);

  // Toggle dropdown with improved event handling - FIXED
  const toggleDropdown = useCallback((index, e) => {
    if (e) e.stopPropagation();
    setActiveDropdownIndex(prev => prev === index ? null : index);
  }, []);

  // Apply sorting and filtering with memo for performance
  const filteredAndSortedPartners = useMemo(() => {
    let result = [...partners];
    
    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(partner => 
        partner.name.toLowerCase().includes(lowercasedFilter) || 
        partner.brandname.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    return result;
  }, [partners, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-200">
      <NavBar />
      <div className="flex m-4 gap-3">
        <Leftsidebar />
        <div className="flex-1">
          <div className="bg-white rounded-2xl h-[calc(100vh-6rem)] shadow-md">
            {/* Header with Add Partner button and search */}
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">Partner Management</h1>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Search box */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search partners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    aria-label="Search partners"
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
                
                {/* Add partner button */}
                <button
                  onClick={() => openModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  aria-label="Add new partner"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Add Partner</span>
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="py-2 px-6 ">
              {filteredAndSortedPartners.length === 0 ? (
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
                ) : partners.length === 0 ? (
                  <EmptyState onAddPartner={() => openModal()} />
                ) : null
              ) : (
                <div className="overflow-hidden flex flex-col">
                  {/* Fixed table header */}
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200 border-b border-gray-300">
                        <th className="px-6 py-3 text-left font-semibold w-2/5">
                          Brand Name
                        </th>
                        <th className="px-6 py-3 text-left font-semibold w-2/5">
                          Partner Name
                        </th>
                        <th className="px-6 py-3 text-center font-semibold w-1/5">Actions</th>
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
                        {filteredAndSortedPartners.map((partner, index) => (
                          <PartnerRow
                            key={`${partner.name}-${partner.brandname}-${index}`}
                            partner={partner}
                            index={index}
                            isAnimating={animation.index === index}
                            animationType={animation.type}
                            onToggleDropdown={toggleDropdown}
                            isDropdownOpen={activeDropdownIndex === index}
                            dropdownRef={dropdownRef}
                            onEdit={openModal}
                            onDelete={deletePartner}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Partner count */}
                  <div className="flex justify-between items-center py-3 px-6 border-t border-gray-200 text-sm text-gray-500">
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

      {/* Animation styles */}
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

        .scrollbar-thin::-webkit-scrollbar {
          display: none;
        }

      `}</style>
    </div>
  );
};

export default Partners;