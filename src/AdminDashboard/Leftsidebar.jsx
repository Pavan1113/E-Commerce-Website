import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Leftsidebar = ({ onClose, isMobile = false, isOpen = false }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user name with error handling
  const getUserName = () => {
    try {
      const user = localStorage.getItem("logedInUser");
      return user ? JSON.parse(user) : "Admin";
    } catch (error) {
      return "Admin";
    }
  };
  
  const [name] = useState(getUserName());

  // Close settings dropdown when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSettingsOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Determine active path for highlighting
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if any settings item is active
  const isSettingsActive = () => {
    return isActive("/brand") || isActive("/partners") || isActive("/collection");
  };

  // SVG Icons with improved responsive sizing
  const Icons = {
    Dashboard: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={props.size || 20} 
        height={props.size || 20} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={props.className || ""}
      >
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    ),
    Settings: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={props.size || 20} 
        height={props.size || 20} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={props.className || ""}
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    ChevronDown: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={props.size || 16} 
        height={props.size || 16}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={props.className || ""}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    ),
    Brand: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={props.size || 18} 
        height={props.size || 18} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={props.className || ""}
      >
        <circle cx="13.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="10.5" r="2.5" />
        <circle cx="8.5" cy="7.5" r="2.5" />
        <circle cx="6.5" cy="12.5" r="2.5" />
        <path d="M12 22v-6" />
        <path d="M4.5 16.5c0-3.5 6-3.5 8.5-3.5s8.5 0 8.5 3.5" />
      </svg>
    ),
    Partners: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={props.size || 18} 
        height={props.size || 18}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={props.className || ""}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    Collection: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={props.size || 18} 
        height={props.size || 18}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={props.className || ""}
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    Close: (props) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={props.size || 24} 
        height={props.size || 24}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={props.className || ""}
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    )
  };

  // Navigation items
  const navItems = [
    { 
      id: "dashboard", 
      label: "Products", 
      path: "/products",
      icon: <Icons.Dashboard className="transition-transform duration-300" />
    }
  ];

  // Settings dropdown items
  const settingsItems = [
    { id: "brand", label: "Brand", path: "/brand", icon: <Icons.Brand size={18} /> },
    { id: "partners", label: "Partners", path: "/partners", icon: <Icons.Partners size={18} /> },
    { id: "collections", label: "Collections", path: "/collection", icon: <Icons.Collection size={18} /> }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (isMobile && onClose) {
      onClose();
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Sidebar classes based on mobile/desktop
  const sidebarClasses = isMobile 
    ? "fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
    : "flex flex-col w-full lg:w-64 xl:w-72 bg-gray-50 border-r border-gray-100 rounded-2xl transition-all duration-300";

  const containerClasses = isMobile
    ? "flex flex-col h-full p-4 overflow-y-auto"
    : "flex flex-col h-[calc(100vh-6rem)] p-4 overflow-y-auto";

  return (
    <aside className={sidebarClasses}>
      <div className={containerClasses}>
        {/* Mobile Header with Close Button */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <Icons.Close size={20} className="text-gray-600" />
            </button>
          </div>
        )}

        {/* Desktop Logo Area */}
        {!isMobile && (
          <div className="mb-6 px-2">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
        )}
        
        {/* Main Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                ${isActive(item.path) 
                  ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" 
                  : "bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200"}`}
            >
              {item.icon}
              <span className="text-sm sm:text-base font-medium">{item.label}</span>
            </button>
          ))}

          {/* Settings Dropdown */}
          <div className="mt-2">
            <button
              onClick={toggleSettings}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 text-left
                ${isSettingsActive()
                  ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" 
                  : "bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200"}`}
              aria-expanded={isSettingsOpen}
              aria-controls="settings-menu"
            >
              <div className="flex items-center gap-3">
                <Icons.Settings className="transition-transform duration-300" />
                <span className="text-sm sm:text-base font-medium">Settings</span>
              </div>
              <Icons.ChevronDown 
                className={`transition-transform duration-300 ${isSettingsOpen ? "rotate-180" : ""}`} 
                size={16} 
              />
            </button>

            {/* Settings Menu */}
            <div 
              id="settings-menu"
              className={`overflow-hidden transition-all duration-300 ${
                isSettingsOpen ? "max-h-64 mt-2 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="flex flex-col gap-1 pl-2">
                {settingsItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-200 text-left
                        ${isActive(item.path)
                          ? "bg-blue-50 text-blue-600 border border-blue-100" 
                          : "bg-white text-gray-600 hover:bg-gray-100 active:bg-gray-200"}`}
                    >
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Bottom Section - User Profile */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-600 bg-white rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {name ? name.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-700 truncate block">
                {name}
              </span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Leftsidebar;
