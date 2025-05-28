import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../AdminDashboard/NavBar";

const Dashboard = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const products = JSON.parse(localStorage.getItem("products")) || [];

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(input));
  }, [input]);

  function showDetails(index) {
    const product = products[index];
    navigate("/product-detail", { state: product });
  }

  function handleEvent(item) {
    const exists = input.find((cartItem) => cartItem.id === item.id);
    if (!exists) {
      const newCart = [...input, item];
      setInput(newCart);
    } else {
    }
  }

  function cartDetails() {
    navigate("/cart");
  }

  return (
    <>
      <div className="flex flex-col" style={{position: "sticky" ,top:"0", zIndex:100}}>
        <NavBar />
      </div>

      <div className="flex justify-end m-5 mr-10">
        <button type="button" onClick={cartDetails}>
          <div className="flex border border-zinc-500 text-indigo-500 text-[18px] gap-2 p-2">
            <i className="fa-solid fa-cart-shopping text-[26px]"></i>
            Cart 
            <p className="text-zinc-900">({input.length})</p>
          </div>
        </button>
      </div>

      <div className="flex pt-5 pl-4 h-full w-full bg-white flex-wrap gap-4 justify-start">
        {products.length > 0 &&
          products.map((item, index) => {
            const existsIndex = input.some((cartItem) => cartItem.id === item.id);

            return (
              <div
                key={item.id || index} // Use item.id if available, otherwise fallback to index
                className="border border-[#ccc] w-[250px] p-3 flex flex-col gap-1 rounded-2xl transition duration-500 hover:scale-105 hover:shadow-custom"
              >
                <div className="h-48">
                  <img
                    src={item.image}
                    style={{ height: "100%", width: "100%", cursor: "pointer" }}
                    onClick={() => showDetails(index)}
                    alt={item.brandname || "Product"}
                  />
                </div>

                <div className="flex flex-col p-2 gap-4">
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <span
                        className="text-l font-bold cursor-pointer"
                        onClick={() => showDetails(index)}
                      >
                        {item.brandname}
                      </span>
                      <p className="text-md">
                        {item.collectionname && item.collectionname.length > 40
                          ? item.collectionname.slice(0, 40) + "..."
                          : item.collectionname}{" "}
                        {item.color}
                      </p>

                      <div className="flex gap-1 text-lg my-2">
                        <i className="fa-solid fa-star text-orange-600"></i>
                        <i className="fa-solid fa-star text-orange-600"></i>
                        <i className="fa-solid fa-star text-orange-600"></i>
                        <i className="fa-solid fa-star text-orange-600"></i>
                        <i className="fa-regular fa-star text-orange-600"></i>
                      </div>

                      <p
                        className="text-xl cursor-pointer"
                        onClick={() => showDetails(index)}
                      >
                        ₹ {item.price}
                      </p>
                    </div>
                  </div>

                  {existsIndex ? (
                    <button
                      className="hover:bg-green-700 bg-[#16a34a] text-white py-2 rounded-md"
                      onClick={cartDetails}
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      className="hover:bg-[#1d4ed8] bg-[#2563eb] text-white py-2 rounded-md"
                      onClick={() => handleEvent(item)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Dashboard;