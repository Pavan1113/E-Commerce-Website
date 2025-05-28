import React, { useEffect, useRef, useState } from "react";
import { image } from "../images";
import { NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
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
        className="flex flex-col gap-3"
        style={{ backgroundColor: "rgb(0 0 0 / 0.1)" }}
      >
        <nav className=" flex items-center justify-between bg-black ">
          <div className="flex items-center gap-4 px-3">
            <img src={image.logo} height={"40px"} width={"40px"} alt="" />
            <p className=" text-[26px] font-[700] text-[white]">E-Commerce</p>
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="text"
              style={{
                paddingRight: "36px",
                paddingLeft: "8px",
                height: "32px",
                borderRadius: "4px",
                outline:"0",
              }}
              placeholder="Search"
            />
            <div
              className="bg-[#f3a847] flex items-center justify-center absolute p-[4px] rounded-[4px] h-[32px] w-[32px] "
              style={{
                top: "50%",
                right: "0px",
                transform: "translateY(-50%)",
              }}
            >
              <i className="fa-solid fa-magnifying-glass text-white text-sm"></i>
            </div>
          </div>

          <div className="py-4 flex justify-end items-center gap-3 pr-4">
            <img
              src={image.user}
              style={{ height: "30px", width: "30px" }}
              alt=""
            />
            <div className="dropdown1" ref={dropdownRef}>
              <button
                className="dropdown-button flex gap-2 items-center"
                style={{ position: "relative" }}
                onClick={() => setIsActive(!isActive)}
              >
                <span style={{ fontSize: "20px", color: "white" }}>{name}</span>
                <img
                  src={image.downArrow}
                  alt="Dropdown"
                  style={{
                    height: "10px",
                    width: "15px",
                    transform: isActive ? "rotate(180deg)" : "none",
                    transition: "ease-in-out .3s",
                  }}
                />
              </button>
              {isActive && (
                <div
                  className="border border-zinc-700 flex items-center p-2 bg-white text-black"
                  onClick={logoutHandler}
                  style={{
                    position: "absolute",
                    right: "1px",
                    transition: "ease-in-out .5s",
                  }}
                >
                  <NavLink>Logout</NavLink>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
