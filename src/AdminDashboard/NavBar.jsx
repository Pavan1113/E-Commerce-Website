import React, { useEffect, useRef, useState } from "react";
import { image } from "../images";
import { NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const name = JSON.parse(localStorage.getItem("logedInUser"));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  const Navigate = useNavigate();

  function logoutHandler() {
    localStorage.removeItem("logedInUser");
    Navigate("/Login");
  }

  return (
    <div>
      <div
        className="flex flex-col"
        style={{ backgroundColor: "rgb(0 0 0 / 0.1)" }}
      >
        <nav className="flex items-center justify-between bg-black px-3 py-2 md:py-0">
          {/* Logo Section */}
          <div className="flex items-center gap-2 md:gap-4">
            <img 
              src={image.logo} 
              className="h-8 w-8 md:h-10 md:w-10" 
              alt="Logo" 
            />
            <p className="text-lg md:text-[26px] font-[700] text-white">
              E-Commerce
            </p>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block relative">
            <input
              type="text"
              className="pr-9 pl-3 h-8 rounded border-0 outline-0 w-64 lg:w-80"
              placeholder="Search"
            />
            <div className="bg-[#f3a847] flex items-center justify-center absolute p-1 rounded h-8 w-8 top-1/2 right-0 transform -translate-y-1/2">
              <i className="fa-solid fa-magnifying-glass text-white text-sm"></i>
            </div>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex py-4 justify-end items-center gap-3">
            <img
              src={image.user}
              className="h-7 w-7 md:h-8 md:w-8"
              alt="User"
            />
            <div className="dropdown1" ref={dropdownRef}>
              <button
                className="dropdown-button flex gap-2 items-center relative"
                onClick={() => setIsActive(!isActive)}
              >
                <span className="text-base md:text-xl text-white">{name}</span>
                <img
                  src={image.downArrow}
                  alt="Dropdown"
                  className="h-2.5 w-4"
                  style={{
                    transform: isActive ? "rotate(180deg)" : "none",
                    transition: "ease-in-out .3s",
                  }}
                />
              </button>
              {isActive && (
                <div
                  className="border border-zinc-700 flex items-center p-2 bg-white text-black absolute right-0 top-full mt-1 rounded shadow-lg z-50 min-w-max"
                  onClick={logoutHandler}
                  style={{
                    transition: "ease-in-out .5s",
                  }}
                >
                  <NavLink className="cursor-pointer hover:text-gray-600">
                    Logout
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-gray-700">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pr-10 pl-3 h-10 rounded border-0 outline-0"
                  placeholder="Search"
                />
                <div className="bg-[#f3a847] flex items-center justify-center absolute p-2 rounded h-10 w-10 top-1/2 right-0 transform -translate-y-1/2">
                  <i className="fa-solid fa-magnifying-glass text-white text-sm"></i>
                </div>
              </div>
            </div>

            {/* Mobile User Section */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={image.user}
                  className="h-8 w-8"
                  alt="User"
                />
                <span className="text-white text-lg">{name}</span>
              </div>
              <button
                onClick={() => {
                  logoutHandler();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <i className="fa-solid fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
