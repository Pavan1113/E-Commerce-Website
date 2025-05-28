import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../form.css";

const Registerform = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const Users = JSON.parse(localStorage.getItem("data"))||[]
  const [inputarr, setinputarr] = useState(Users);
  const Navigate = useNavigate();

  function handleUser(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  function handleAdmin(e){
    setUser({
      ...user,
      [e.target.name]: e.target.value,isAdmin:!user.isAdmin
    });
  }

  function Validation() {
    const Regex = /^[A-Za-z+\s]+$/;
    const email = /^([a-z0-9_(.)-]+)@([\da-z(.)-]+)(.)([a-z(.)]{2,6})$/g;
    if (user.name.trim() === "" || !Regex.test(user.name)) {
      alert("Invalid Name");
      return false;
    } else if (!email.test(user.email)) {
      alert("Invalid email");
      return false;
    }
    return true;
  }
  function handleSubmit(e) {
    if (!Validation()) {
      return;
    }
    e.preventDefault();
    setinputarr([...inputarr, { ...user }]);
    Navigate("/Login");
  }

  useEffect(()=>{
    localStorage.setItem("data",JSON.stringify(inputarr))
  },[inputarr])

  return (
    <>
      <div className="body">
        <div className="form">
          <div class="form-container">
            <p class="title">Register Form</p>
            <form class="form-input">
              <input
                type="text"
                class="input1 bg-white-700 text-black-700 border border-zinc-700 rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                placeholder="Name"
                onChange={handleUser}
                value={user.name}
                name="name"
              />
              <input
                type="email"
                class="input1 bg-white-700 text-black-700 border border-zinc-700 rounded-md p-2 mb-4 focus:bg-white-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                placeholder="E-mail"
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
              <div className="flex gap-3 ml-5">
              <input type="checkbox" id="admin" name="admin" onChange={handleAdmin} />
              <label htmlFor="admin">Admin</label>
              </div>
              <div className="btn">
                <button
                  class="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold w-[150px] py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </button>
              </div>
            </form>
            <p class="sign-up-label">
              Already have an account?{" "}
              <NavLink to={"/Login"}>
                <li> Login</li>
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registerform;
