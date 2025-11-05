import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../form.css";

const Registerform = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();

  // Get existing users from localStorage
  const getUsersData = () => {
    try {
      const storedData = localStorage.getItem("data");
      if (!storedData) {
        return [];
      }
      const parsedData = JSON.parse(storedData);
      return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
      console.error("Error parsing users data:", error);
      return [];
    }
  };

  const [inputarr, setinputarr] = useState(getUsersData());

  function handleUser(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  function handleAdmin(e) {
    setUser({
      ...user,
      role: e.target.checked ? "admin" : "user",
    });
  }

  function Validation() {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (user.name.trim() === "") {
      alert("Name is required");
      return false;
    }
    
    if (!nameRegex.test(user.name.trim())) {
      alert("Name should contain only letters and spaces");
      return false;
    }
    
    if (user.name.trim().length < 2) {
      alert("Name must be at least 2 characters long");
      return false;
    }
    
    if (user.email.trim() === "") {
      alert("Email is required");
      return false;
    }
    
    if (!emailRegex.test(user.email.trim())) {
      alert("Please enter a valid email address");
      return false;
    }
    
    if (user.password.trim() === "") {
      alert("Password is required");
      return false;
    }
    
    if (user.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return false;
    }
    
    const existingUser = inputarr.find(existingUser => 
      existingUser.email.toLowerCase() === user.email.toLowerCase().trim()
    );
    
    if (existingUser) {
      alert("Email already exists. Please use a different email or login.");
      return false;
    }
    
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!Validation()) {
      return;
    }
    
    setIsLoading(true);
    
    // Create user object with unique ID and clean data
    const newUser = {
      id: Date.now(), 
      name: user.name.trim(),
      email: user.email.toLowerCase().trim(),
      password: user.password,
      role: user.role,
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...inputarr, newUser];
    setinputarr(updatedUsers);
    
    localStorage.setItem("data", JSON.stringify(updatedUsers));
    
    setUser({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
    
    setIsLoading(false);
    alert("Registration successful! Please login with your credentials.");
    Navigate("/Login");
  }

  // Save to localStorage whenever inputarr changes
  useEffect(() => {
    if (inputarr.length > 0) {
      localStorage.setItem("data", JSON.stringify(inputarr));
    }
  }, [inputarr]);

  return (
    <>
      <div className="body">
        <div className="form">
          <div className="form-container">
            <p className="title">Registration Form</p>
            <form className="form-input" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="input1 bg-white-700 text-black-700 border border-zinc-700 rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  placeholder="Full Name"
                  onChange={handleUser}
                  value={user.name}
                  name="name"
                  required
                  disabled={isLoading}
                  minLength="2"
                  maxLength="50"
                />
              </div>
              
              <div className="input-group">
                <input
                  type="email"
                  className="input1 bg-white-700 text-black-700 border border-zinc-700 rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  placeholder="Email Address"
                  onChange={handleUser}
                  value={user.email}
                  name="email"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="input-group">
                <input
                  type="password"
                  className="input1 bg-white-700 text-black-700 border border-zinc-700 rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  placeholder="Password (min 6 characters)"
                  onChange={handleUser}
                  value={user.password}
                  name="password"
                  required
                  disabled={isLoading}
                  minLength="6"
                />
              </div>
              
              <div className="flex items-center gap-3 ml-5 mb-4">
                <input 
                  type="checkbox" 
                  id="admin" 
                  name="admin" 
                  onChange={handleAdmin}
                  checked={user.role === "admin"}
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="admin" className="text-sm font-medium text-gray-700">
                  Register as Admin
                </label>
              </div>
              
              <div className="btn">
                <button
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold w-[150px] py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Submit"}
                </button>
              </div>
            </form>
            
            <p className="sign-up-label">
              Already have an account?{" "}
              <NavLink to={"/Login"} className="text-blue-600 hover:text-blue-800 font-medium">
                <span>Sign In</span>
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registerform;