import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import NavBar from "./NavBar";
import Leftsidebar from "./Leftsidebar";

const CollectionModal = React.memo(({ isOpen, collection, brands, partners, onClose, onSave, isEditing }) => {
  const [formData, setFormData] = useState({ name: "", brandname: "", partnersname: "" });
  const modalRef = useRef(null);

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
    
    if (name === "brandname" && value !== formData.brandname) {
      setFormData({
        ...formData,
        [name]: value,
        partnersname: "" 
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Collection" : "Add New Collection"}
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
            <select
              name="partnersname"
              value={formData.partnersname}
              onChange={handleInputChange}
              disabled={!formData.brandname}
              className={`w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all text-sm md:text-base ${
                !formData.brandname ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              }`}
              aria-required="true"
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
              <p className="text-orange-500 text-xs md:text-sm mt-1">
                No partners available for this brand. Please add a partner first.
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
              Collection Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter collection name"
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

const EmptyState = React.memo(({ onAddCollection }) => (
  <div className="text-center py-8 md:py-12 px-4">
    <div className="mb-4">
      <i className="fa-solid fa-layer-group text-4xl md:text-6xl text-gray-300 mb-4"></i>
    </div>
    <p className="text-gray-500 text-base md:text-lg mb-2">No collections added yet.</p>
    <p className="text-gray-400 mb-4 text-sm md:text-base">Add your first collection to get started</p>
    <button
      onClick={onAddCollection}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
      aria-label="Add first collection"
    >
      <i className="fa-solid fa-plus mr-2"></i>
      Add Your First Collection
    </button>
  </div>
));

const CollectionRow = React.memo(({ collection, originalIndex, isAnimating, animationType, onEdit, onDelete }) => (
  <tr 
    className={`border-b border-gray-200 ${
      isAnimating && animationType === 'delete' 
        ? 'animate-slide-out-right opacity-0' 
        : isAnimating && animationType === 'update'
        ? 'animate-pulse bg-blue-50'
        : 'hover:bg-gray-50'
    } transition-all duration-300`}
  >
    <td className="px-3 md:px-6 py-4 w-1/4">
      <div className="truncate max-w-full text-sm md:text-base font-medium text-gray-800" title={collection.brandname}>
        {collection.brandname}
      </div>
    </td>
    <td className="px-3 md:px-6 py-4 w-1/4">
      <div className="truncate max-w-full text-sm md:text-base font-medium text-gray-800" title={collection.partnersname}>
        {collection.partnersname}
      </div>
    </td>
    <td className="px-3 md:px-6 py-4 w-1/4">
      <div className="truncate max-w-full text-sm md:text-base font-medium text-gray-800" title={collection.name}>
        {collection.name}
      </div>
    </td>
    <td className="px-3 md:px-6 py-4 w-1/4">
      <div className="flex justify-center gap-3">
        <button
          onClick={() => onEdit(collection, originalIndex)}
          className="inline-flex items-center px-3 py-2 border border-blue-300 bg-blue-50 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm"
          aria-label="Edit collection"
        >
          <i className="fa-solid fa-pen-to-square text-xs mr-1.5"></i>
          <span className="hidden sm:inline">Edit</span>
        </button>
        
        <button
          onClick={() => onDelete(originalIndex)}
          className="inline-flex items-center px-3 py-2 border border-red-300 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 shadow-sm"
          aria-label="Delete collection"
        >
          <i className="fa-solid fa-trash text-xs mr-1.5"></i>
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </td>
  </tr>
));

const CollectionCard = React.memo(({ collection, originalIndex, isAnimating, animationType, onEdit, onDelete }) => (
  <div 
    className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm ${
      isAnimating && animationType === 'delete' 
        ? 'animate-slide-out-right opacity-0' 
        : isAnimating && animationType === 'update'
        ? 'animate-pulse bg-blue-50'
        : 'hover:shadow-md'
    } transition-all duration-300`}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1 mr-4">
        <h3 className="font-semibold text-gray-800 truncate text-base mb-2" title={collection.name}>
          {collection.name}
        </h3>
        <div className="space-y-1 text-sm">
          <div>
            <span className="text-gray-600 font-medium">Brand:</span>
            <span className="ml-2 text-gray-800">{collection.brandname}</span>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Partner:</span>
            <span className="ml-2 text-gray-800">{collection.partnersname}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="flex gap-2 mt-3">
      {/* Structured Edit Button for Mobile */}
      <button
        onClick={() => onEdit(collection, originalIndex)}
        className="inline-flex items-center px-3 py-2 border border-blue-300 bg-blue-50 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm flex-1 justify-center"
        aria-label="Edit collection"
      >
        <i className="fa-solid fa-pen-to-square text-xs mr-1.5"></i>
        <span>Edit</span>
      </button>
      
      {/* Structured Delete Button for Mobile */}
      <button
        onClick={() => onDelete(originalIndex)}
        className="inline-flex items-center px-3 py-2 border border-red-300 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 shadow-sm flex-1 justify-center"
        aria-label="Delete collection"
      >
        <i className="fa-solid fa-trash text-xs mr-1.5"></i>
        <span>Delete</span>
      </button>
    </div>
  </div>
));

const Collection = () => {
  const [collections, setCollections] = useState(() => {
    return JSON.parse(localStorage.getItem("collection")) || [];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [animation, setAnimation] = useState({ index: null, type: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const tableRef = useRef(null);

  const brands = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("brand")) || [];
    } catch (error) {
      console.error("Error parsing brands from localStorage:", error);
      return [];
    }
  }, []);
  
  const partners = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("partners")) || [];
    } catch (error) {
      console.error("Error parsing partners from localStorage:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("collection", JSON.stringify(collections));
  }, [collections]);

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

  const openModal = useCallback((collectionToEdit = null, index = null) => {
    setCurrentCollection(collectionToEdit);
    setEditIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentCollection(null);
    setEditIndex(null);
  }, []);

  const handleSubmit = useCallback((formData) => {
    if (!formData.name.trim() || !formData.brandname || !formData.partnersname) return;

    if (editIndex !== null) {
      setAnimation({ index: editIndex, type: "update" });
      
      setTimeout(() => {
        setCollections(prev => 
          prev.map((collection, i) => (i === editIndex ? formData : collection))
        );
        
        setTimeout(() => {
          setAnimation({ index: null, type: null });
        }, 600);
      }, 300);
    } else {
      setCollections(prev => [...prev, formData]);
    }
    
    closeModal();
  }, [editIndex, closeModal]);

  const deleteCollection = useCallback((index) => {
    setAnimation({ index, type: "delete" });
    
    setTimeout(() => {
      setCollections(prev => prev.filter((_, i) => i !== index));
      setAnimation({ index: null, type: null });
    }, 500);
  }, []);

  const filteredAndSortedCollections = useMemo(() => {
    let result = [...collections];
    
    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(collection => 
        collection.name.toLowerCase().includes(lowercasedFilter) ||
        collection.brandname.toLowerCase().includes(lowercasedFilter) ||
        collection.partnersname.toLowerCase().includes(lowercasedFilter)
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
  }, [collections, searchTerm, sortConfig]);

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
            {collections.length > 0 && (
              <div className="p-4 md:p-6 flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 border-b border-gray-200">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Collection Management</h1>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
                  <div className="relative w-full sm:flex-1 lg:w-64">
                    <input
                      type="text"
                      placeholder="Search collections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 pl-8 md:pl-10 pr-8 md:pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm md:text-base"
                      aria-label="Search collections"
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
                  
                  {/* Add collection button */}
                  <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto text-sm md:text-base shadow-sm"
                    aria-label="Add new collection"
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span className="hidden sm:inline">Add Collection</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Content area */}
            <div className="py-2 px-4 md:px-6">
              {filteredAndSortedCollections.length === 0 ? (
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
                ) : collections.length === 0 ? (
                  <EmptyState onAddCollection={() => openModal()} />
                ) : null
              ) : (
                <div className="overflow-hidden flex flex-col">
                  <div className="hidden md:block">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 w-1/4 text-sm md:text-base">
                            Brand Name
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 w-1/4 text-sm md:text-base">
                            Partner Name
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 w-1/4 text-sm md:text-base">
                            Collection Name
                          </th>
                          <th className="px-6 py-4 text-center font-semibold text-gray-700 w-1/4 text-sm md:text-base">Actions</th>
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
                          {filteredAndSortedCollections.map((collection, displayIndex) => {
                            const originalIndex = collections.findIndex(c => 
                              c.name === collection.name && 
                              c.brandname === collection.brandname && 
                              c.partnersname === collection.partnersname
                            );
                            return (
                              <CollectionRow
                                key={`${originalIndex}-${collection.name}-${collection.brandname}`}
                                collection={collection}
                                originalIndex={originalIndex}
                                isAnimating={animation.index === originalIndex}
                                animationType={animation.type}
                                onEdit={openModal}
                                onDelete={deleteCollection}
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
                      {filteredAndSortedCollections.map((collection, displayIndex) => {
                        const originalIndex = collections.findIndex(c => 
                          c.name === collection.name && 
                          c.brandname === collection.brandname && 
                          c.partnersname === collection.partnersname
                        );
                        return (
                          <CollectionCard
                            key={`${originalIndex}-${collection.name}-${collection.brandname}`}
                            collection={collection}
                            originalIndex={originalIndex}
                            isAnimating={animation.index === originalIndex}
                            animationType={animation.type}
                            onEdit={openModal}
                            onDelete={deleteCollection}
                          />
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Collection count */}
                  <div className="flex justify-between items-center py-3 px-4 md:px-6 border-t border-gray-200 text-xs md:text-sm text-gray-500">
                    <div>
                      {searchTerm 
                        ? `${filteredAndSortedCollections.length} of ${collections.length} collections`
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
          width: 0;
          overflow-y: hidden;
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

export default Collection;
