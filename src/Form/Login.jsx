import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();
  
  const getUsersData = () => {
    try {
      const storedData = localStorage.getItem("data");
      if (!storedData) {
        return [];
      }
      const parsedData = JSON.parse(storedData);
      return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return [];
    }
  };
  
  const data = getUsersData();

  function handleUser(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function Validation() {
    const email = /^([a-z0-9_(.)-]+)@([\da-z(.)-]+)(.)([a-z(.)]{2,6})$/g;
    
    if (user.email.trim() === "") {
      alert("Please enter your email");
      return false;
    }
    
    if (!email.test(user.email)) {
      alert("Invalid email format");
      return false;
    }
    
    if (user.password.trim() === "") {
      alert("Please enter your password");
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

    if (data.length === 0) {
      alert("No users found. Please register first.");
      setIsLoading(false);
      return;
    }

    const foundUser = data.find((item) => item.email === user.email);

    if (!foundUser) {
      alert("User not found. Please check your email or register.");
      setIsLoading(false);
      return;
    }

    if (foundUser.password !== user.password) {
      alert("Invalid password. Please try again.");
      setIsLoading(false);
      return;
    }

    const authData = {
      userId: foundUser.id,
      name: foundUser.name,   
      email: foundUser.email,
      role: foundUser.role || (foundUser.isAdmin ? "admin" : "user"), // Handle both old and new format
      isLoggedIn: true
    };

    localStorage.setItem("userAuth", JSON.stringify(authData));

    setUser({ email: "", password: "" });
    
    if (authData.role === "admin") {
      Navigate("/admindashboard", { replace: true });
    } else {
      Navigate("/dashboard", { replace: true });
    }

    setIsLoading(false);
  }

  return (
    <>
      <div className="body">
        <div className="form">
          <div className="form-container">
            <p className="title">Login</p>
            <form className="form-input" onSubmit={handleSubmit}>
              <input
                type="email"
                className="input1 bg-white-700 text-black-700 border border-zinc-700 rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                placeholder="Email"
                onChange={handleUser}
                value={user.email}
                name="email"
                required
                disabled={isLoading}
              />
              <input
                type="password"
                className="input1 bg-white-700 text-black-700 border border-zinc-700 rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                placeholder="Password"
                onChange={handleUser}
                value={user.password}
                name="password"
                required
                disabled={isLoading}
              />
              <div className="btn">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold w-[150px] py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            <p className="sign-up-label">
              Don't have an account?{" "}
              <NavLink to={"/"}>
                <span>SignUp</span>
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;