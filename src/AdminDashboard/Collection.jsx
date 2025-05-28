import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import NavBar from "./NavBar";
import Leftsidebar from "./Leftsidebar";
import { image } from "../images";

const CollectionDropdown = ({ isOpen, onEdit, onDelete, onClose, position }) => {
  if (!isOpen) return null;
  
  const positionClass = position === 'top' 
    ? "right-0 bottom-10" 
    : "right-0 top-8"; 
  
  return (
    <div 
      className={`absolute ${positionClass} bg-white rounded-lg shadow-lg z-50 py-1 min-w-44 border border-gray-200 animate-dropdown dropdown-menu`}
      onClick={(e) => e.stopPropagation()} 
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 w-full text-left transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <i className="fa-solid fa-pen-to-square text-blue-500"></i>
        </div>
        <span className="font-medium">Edit</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(); 
        }}
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

const CollectionModal = ({ isOpen, collection, brands, partners, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState({ name: "", brandname: "", partnersname: "" });
  const modalRef = useRef(null);

  // Filter partners based on selected brand
  const filteredPartners = useMemo(() => {
    if (!formData.brandname) return [];
    return partners.filter(partner => partner.brandname === formData.brandname);
  }, [partners, formData.brandname]);

  useEffect(() => {
    if (isOpen) {
      setFormData({ 
        name: collection?.name || "", 
        brandname: collection?.brandname || "",
        partnersname: collection?.partnersname || ""
      });
    }
  }, [isOpen, collection]);

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
    
    // Clear partner selection when brand changes
    if (name === "brandname" && value !== formData.brandname) {
      setFormData({
        ...formData,
        [name]: value,
        partnersname: "" // Reset partner when brand changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "name" ? value
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brandname || !formData.partnersname) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Collection" : "Add New Collection"}
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
            <label htmlFor="partnerSelect" className="block text-gray-700 font-medium mb-2">
              Partner Name <span className="text-red-500">*</span>
            </label>
            <select
              id="partnerSelect"
              name="partnersname"
              value={formData.partnersname}
              onChange={handleInputChange}
              disabled={!formData.brandname}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all ${
                !formData.brandname ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              }`}
              required
            >
              <option value="" disabled>
                {!formData.brandname ? "Select a brand first" : "Select Partner"}
              </option>
              {filteredPartners.map((partner, idx) => (
                <option key={idx} value={partner.name}>
                  {partner.name}
                </option>
              ))}
            </select>
            {formData.brandname && filteredPartners.length === 0 && (
              <p className="text-orange-500 text-sm mt-1">
                No partners available for this brand. Please add a partner first.
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="collectionName" className="block text-gray-700 font-medium mb-2">
              Collection Name <span className="text-red-500">*</span>
            </label>
            <input
              id="collectionName"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter collection name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
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
              disabled={!formData.name.trim() || !formData.brandname || !formData.partnersname}
              className={`px-4 py-2 rounded-lg ${
                formData.name.trim() && formData.brandname && formData.partnersname
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

const EmptyState = ({ onAddCollection }) => (
  <div className="text-center py-12">
    <div className="mb-4">
      <img 
        src={image.dots}
        alt="No collections" 
        className="w-16 h-16 mx-auto opacity-30"
      />
    </div>
    <p className="text-gray-500 text-lg mb-2">No collections added yet.</p>
    <p className="text-gray-400 mb-4">Add your first collection to get started</p>
    <button
      onClick={onAddCollection}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <i className="fa-solid fa-plus mr-2"></i>
      Add Your First Collection
    </button>
  </div>
);

const Collection = () => {
  // Custom hook for localStorage
  const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return initialValue;
      }
    });
  
    const setValue = (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    };
  
    return [storedValue, setValue];
  };

  const [collections, setCollections] = useLocalStorage("collection", []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const rowRefs = useRef({});
  
  const brands = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem("brand")) || [];
    } catch (error) {
      console.error("Error parsing brands from localStorage:", error);
      return [];
    }
  }, []);
  
  const partners = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem("partners")) || [];
    } catch (error) {
      console.error("Error parsing partners from localStorage:", error);
      return [];
    }
  }, []);

  const filteredCollections = useMemo(() => {
    if (!searchTerm.trim()) return collections;
    
    const lowercasedFilter = searchTerm.toLowerCase();
    return collections.filter(collection => 
      collection.name.toLowerCase().includes(lowercasedFilter) || 
      collection.brandname.toLowerCase().includes(lowercasedFilter) ||
      collection.partnersname.toLowerCase().includes(lowercasedFilter)
    );
  }, [collections, searchTerm]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdownIndex !== null) {
        const isClickInsideDropdownButton = Boolean(
          event.target.closest('[data-dropdown-toggle]')
        );
        
        const isClickInsideDropdown = Boolean(
          event.target.closest('.dropdown-menu')
        );
        
        if (!isClickInsideDropdownButton && !isClickInsideDropdown) {
          setActiveDropdownIndex(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdownIndex]);

  // Modal handlers
  const openModal = useCallback((collectionToEdit = null, index = null) => {
    setCurrentCollection(collectionToEdit);
    setEditIndex(index);
    setIsModalOpen(true);
    setActiveDropdownIndex(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentCollection(null);
    setEditIndex(null);
  }, []);

  // Form submission handler
  const handleSubmit = useCallback((formData) => {
    if (!formData.name.trim() || !formData.brandname || !formData.partnersname) {
      return; 
    }

    if (editIndex !== null) {
      // Update existing collection
      setCollections(prev => 
        prev.map((collection, i) => (i === editIndex ? formData : collection))
      );
    } else {
      // Add new collection
      setCollections(prev => [...prev, formData]);
    }
    
    closeModal();
  }, [editIndex, setCollections, closeModal]);

  // Delete collection - Fixed version
  const deleteCollection = useCallback((index) => {
    // Find the actual index in the original collections array
    const collectionToDelete = filteredCollections[index];
    const originalIndex = collections.findIndex(c => 
      c.name === collectionToDelete.name && 
      c.brandname === collectionToDelete.brandname && 
      c.partnersname === collectionToDelete.partnersname
    );
    
    if (originalIndex !== -1) {
      setCollections(prev => prev.filter((_, i) => i !== originalIndex));
    }
    
    setActiveDropdownIndex(null);
  }, [collections, filteredCollections, setCollections]);

  // Get dropdown position
  const getDropdownPosition = useCallback((index) => {
    const row = rowRefs.current[index];
    
    if (row) {
      const rowRect = row.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isNearBottom = (viewportHeight - rowRect.bottom) < 150;
      return isNearBottom ? 'top' : 'bottom';
    }
    
    return index >= filteredCollections.length - 3 ? 'top' : 'bottom';
  }, [filteredCollections.length]);

  // Toggle dropdown
  const toggleDropdown = useCallback((index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setActiveDropdownIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  // Handle edit action
  const handleEdit = useCallback((collection, index) => {
    setActiveDropdownIndex(null);
    setTimeout(() => {
      // Find the original index for editing
      const originalIndex = collections.findIndex(c => 
        c.name === collection.name && 
        c.brandname === collection.brandname && 
        c.partnersname === collection.partnersname
      );
      openModal(collection, originalIndex);
    }, 50);
  }, [collections, openModal]);

  // Handle delete action
  const handleDelete = useCallback((index) => {
    setActiveDropdownIndex(null);
    setTimeout(() => {
      deleteCollection(index);
    }, 50);
  }, [deleteCollection]);

  return (
    <div className="min-h-screen bg-gray-200">
      <NavBar />
      <div className="flex m-4 gap-3">
        <Leftsidebar />
        <div className="flex-1">
          <div className="bg-white rounded-2xl h-[calc(100vh-6rem)] shadow-md">
            {/* Header */}
            <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">Collection Management</h1>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Search box */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fa-solid fa-search"></i>
                  </div>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  )}
                </div>
                
                {/* Add collection button */}
                <button
                  onClick={() => openModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Add Collection</span>
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="py-2 px-6">
              {filteredCollections.length === 0 ? (
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
                ) : collections.length === 0 ? (
                  <EmptyState onAddCollection={() => openModal()} />
                ) : null
              ) : (
                <div className="overflow-hidden flex flex-col">
                  {/* Table header */}
                  <table className="w-full table-fixed border-collapse">
                    <thead>
                      <tr className="bg-gray-200 border-b border-gray-300">
                        <th className="px-6 py-3 text-left font-semibold">Brand Name</th>
                        <th className="px-6 py-3 text-left font-semibold">Partner Name</th>
                        <th className="px-6 py-3 text-left font-semibold">Collection Name</th>
                        <th className="px-6 py-3 text-center font-semibold">Action</th>
                      </tr>
                    </thead>
                  </table>
                  
                  {/* Table body */}
                  <div 
                    className="overflow-y-auto overflow-x-hidden scrollbar-thin" 
                    style={{ maxHeight: "calc(100vh - 290px)" }}
                  >
                    <table className="w-full table-fixed border-collapse">
                      <tbody>
                        {filteredCollections.map((collection, index) => (
                          <tr 
                            key={`${collection.name}-${collection.brandname}-${index}`}
                            ref={(el) => { if (el) rowRefs.current[index] = el; }}
                            className="border-b border-gray-200 hover:bg-gray-50 transition-colors relative"
                          >
                            <td className="px-6 py-3">
                              <div className="truncate" title={collection.brandname}>
                                {collection.brandname}
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <div className="truncate" title={collection.partnersname}>
                                {collection.partnersname}
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <div className="truncate" title={collection.name}>
                                {collection.name}
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <div className="flex justify-center relative">
                                <button
                                  onClick={(e) => toggleDropdown(index, e)}
                                  data-dropdown-toggle="true"
                                  className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                                >
                                  <img src={image.dots} alt="More options" width="20" height="24" />
                                </button>
                                
                                <CollectionDropdown 
                                  isOpen={activeDropdownIndex === index}
                                  onEdit={() => handleEdit(collection, index)}
                                  onDelete={() => handleDelete(index)}
                                  onClose={() => setActiveDropdownIndex(null)}
                                  position={getDropdownPosition(index)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex justify-between items-center py-3 px-6 border-t border-gray-200 text-sm text-gray-500">
                    <div>
                      {searchTerm 
                        ? `${filteredCollections.length} of ${collections.length} collections`
                        : `${collections.length} collection${collections.length !== 1 ? 's' : ''}`
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CollectionModal
        isOpen={isModalOpen}
        collection={currentCollection}
        brands={brands}
        partners={partners}
        onClose={closeModal}
        onSave={handleSubmit}
        isEditing={editIndex !== null}
      />

      {/* Animations */}
      <style jsx>{`
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

export default Collection;