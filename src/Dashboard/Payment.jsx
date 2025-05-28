import React, { useEffect, useState } from "react";
import NavBar from "../AdminDashboard/NavBar";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const cart = location.state;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const carts = JSON.parse(localStorage.getItem("cart")) || [];
  const [inputarr, setInputarr] = useState(carts);
  const cartItem = inputarr.some((item) => item.id === cart.id);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(inputarr));
  }, [inputarr]);

  function handlepayment() {
    if (user === null) {
      alert("Please select the payment option");
    } else {
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const newOrders = [...existingOrders, cart];
      localStorage.setItem("orders", JSON.stringify(newOrders));

      const updatedCart = inputarr.filter((item) => item.id !== cart.id);
      setInputarr(updatedCart);
      navigate("/order");
    }
  }

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center pt-10 h-full w-full bg-white">
        <div
          className="border border-zinc-300 p-3 ml-2 flex gap-20"
          style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px" }}
        >
          {cartItem ? (
            <>
              <div className="border border-zinc-300 flex items-center justify-center">
                <div className="h-[300px] w-[300px] bg-white">
                  <img
                    src={cart.image}
                    alt="product"
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
              </div>
              <div className="flex flex-col p-2 gap-4 justify-center">
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">{cart.brandname}</span>
                  <p className="text-lg">{cart.collectionname}</p>
                  <hr />
                  <p className="text-xl font-medium">₹ {cart.price}</p>
                  <p className="text-[16px]">Colour: {cart.color}</p>
                  <p className="text-[16px]">Size: {cart.size}</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    name="cash"
                    id="cash"
                    value="cash"
                    onChange={(e) =>
                      setUser(e.target.checked ? e.target.value : null)
                    }
                  />
                  <label htmlFor="cash">Cash on Delivery</label>
                </div>
                <div className="flex gap-2 justify-start">
                  <button
                    className="hover:bg-sky-700 text-white bg-sky-800 px-4 py-2 rounded-md"
                    onClick={handlepayment}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xl text-green-600 font-semibold">
              Payment Completed
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;

