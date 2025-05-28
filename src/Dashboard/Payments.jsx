import React, { useState } from "react";
import NavBar from "../AdminDashboard/NavBar";
import { useLocation, useNavigate } from "react-router-dom";

const Payments = () => {
  const location = useLocation();
  const cart = location.state;
  const navigate = useNavigate();
  const [isCOD, setIsCOD] = useState(false);

  const carts = JSON.parse(localStorage.getItem("cart")) || [];

  const handlePayment = () => {
    if (!isCOD) {
      alert("Please select a payment option");
      return;
    }
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...existingOrders, ...cart]));
    const updatedCart = carts.map(
      (item) => !cart.some((selected) => selected.id === item.id)
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    navigate("/order");
  };

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center pt-10 bg-white">
        <div className="border border-zinc-300 p-5 flex flex-col gap-6 w-[80%]">
          
          {carts.length>1 ? (
            <>
           {cart.map((item, index) => (
            <div key={index} className="flex gap-6 border p-4">
              <img
                src={item.image}
                alt="product"
                className="w-[200px] h-[200px] object-cover"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.brandname}</h2>
                  <p>{item.collectionname}</p>
                  <p>Color: {item.color}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="text-lg font-medium">₹ {item.price}</p>
              </div>
            </div>
          ))}

          <div className="flex justify-center items-center gap-2">
            <input
              type="checkbox"
              id="cod"
              checked={isCOD}
              onChange={(e) => setIsCOD(e.target.checked)}
            />
            <label htmlFor="cod">Cash on Delivery</label>
          </div>
          <div className=" flex justify-center">
            <button
              className="bg-sky-800 text-white px-6 py-2 rounded hover:bg-sky-700 w-fit"
              onClick={handlePayment}
            >
              Pay Now
            </button>
          </div>
          </>
          ) : (
            <p className="text-xl flex justify-center text-green-600 font-semibold">
              Payment Completed
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
