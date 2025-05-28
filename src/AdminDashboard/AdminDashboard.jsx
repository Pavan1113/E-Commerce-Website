import React from "react";
import Leftsidebar from "./Leftsidebar";
import NavBar from "./NavBar";

const AdminDashboard = () => {

  const name = JSON.parse(localStorage.getItem("logedInUser"));

  return (
    <div>
      <div
        className="flex flex-col gap-3"
        style={{ backgroundColor: "rgb(0 0 0 / 0.1)" }}
      >
        <NavBar />
        <div className="flex justify-start gap-2">
          <Leftsidebar />
        <div className=" flex justify-center items-center w-[100%] rounded-2xl inline-block shadow-lg shadow-black/15 bg-white">
          <div
            className=" h1 flex justify-center items-center"
          >
            <h1 className="text-[26px] font-md">Welcome Admin {name} !!!</h1>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
