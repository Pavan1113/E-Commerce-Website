import React, { useState, useEffect } from "react";
import Leftsidebar from "./Leftsidebar";
import NavBar from "./NavBar";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Get user name from localStorage or use fallback
  const getUserName = () => {
    try {
      const user = localStorage.getItem("logedInUser");
      return user ? JSON.parse(user) : "Admin";
    } catch (error) {
      return "Admin";
    }
  };
  
  const [name] = useState(getUserName());

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close sidebar on mobile when screen size changes
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
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
          {/* Welcome Card */}
          <div className="w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 rounded-xl lg:rounded-2xl shadow-lg bg-white flex justify-center items-center p-4 sm:p-6 md:p-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-3 sm:mb-4 lg:mb-6">
                <i className="fa-solid fa-user-shield text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-blue-500 mb-2 sm:mb-4"></i>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-gray-800 leading-tight">
                Welcome Admin
                <br className="block sm:hidden" />
                <span className="text-blue-600 font-semibold ml-0 sm:ml-2 block sm:inline mt-1 sm:mt-0">
                  {name}
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl ml-1 sm:ml-2">🎉</span>
              </h1>
              <p className="text-gray-600 mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base lg:text-lg max-w-md mx-auto px-2">
                Manage your e-commerce platform with ease
              </p>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {/* Total Orders Card */}
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm sm:text-base font-medium mb-1">Total Orders</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">1,234</p>
                  <p className="text-xs sm:text-sm text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <i className="fa-solid fa-shopping-cart text-2xl sm:text-3xl lg:text-4xl text-green-500"></i>
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm sm:text-base font-medium mb-1">Products</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">567</p>
                  <p className="text-xs sm:text-sm text-blue-600 mt-1">+5 new today</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <i className="fa-solid fa-box text-2xl sm:text-3xl lg:text-4xl text-blue-500"></i>
                </div>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm sm:text-base font-medium mb-1">Revenue</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">$45,678</p>
                  <p className="text-xs sm:text-sm text-yellow-600 mt-1">+8% from last week</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <i className="fa-solid fa-dollar-sign text-2xl sm:text-3xl lg:text-4xl text-yellow-500"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;