import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const Navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("data"));

  function handleUser(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }
  function Validation() {
    const email = /^([a-z0-9_(.)-]+)@([\da-z(.)-]+)(.)([a-z(.)]{2,6})$/g;
    if (!email.test(user.email)) {
      alert("Invalid email");
      return false;
    }
    return true;
  }

  function handleSubmit(e) {
    if (!Validation()) {
      return;
    }
    if (data === null) {
      alert("invalid Email & password");
    } else {
      const login = data.find((item) => item.email === user.email);
      // console.log(login?.isAdmin);
      
      if (login?.email === user.email && login?.password === user.password && login?.isAdmin === false) {
        Navigate("/dashboard");
      }
      else if (login?.email === user.email && login?.password === user.password && login?.isAdmin === true) {
        Navigate("/admindashboard");
      }
      else {
        alert("invalid Email & Password");
      }
      localStorage.setItem("logedInUser", JSON.stringify(login.name));
    }
  }

  return (
    <>
      <div className="body">
        <div className="form">
          <div class="form-container">
            <p class="title">Login</p>
            <form class="form-input">
              <input
                type="email"
                class="input1 bg-white-700 text-black-700 border border-zinc-700 rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                placeholder="Email"
                onChange={handleUser}
                value={user.email}
                name="email"
              />
              <input
                type="password"
                class="input1 bg-white-700 text-black-700 border border-zinc-700 rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                placeholder="Password"
                onChange={handleUser}
                value={user.password}
                name="password"
              />
              <div className="btn">
                <button
                  type="button"
                  class="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold w-[150px] py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                  onClick={() => handleSubmit()}
                >
                  Login
                </button>
              </div>
            </form>
            <p class="sign-up-label">
              Don't have an account?
              <NavLink to={"/"}>
                <li>SignUp</li>
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
