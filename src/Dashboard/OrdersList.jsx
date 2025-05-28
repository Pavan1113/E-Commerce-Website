import React from "react";
import NavBar from "../AdminDashboard/NavBar";

const OrdersList = () => {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  return (
    <div>
      <NavBar />
      <div className="flex items-center justify-center">
        <div
          className="m-5 w-[60%] border border-zinc-300"
          style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px" }}
        >
          <div class=" px-10 ml-2 pb-7 flex flex-col justify-between">
            <div className="p-5 pb-0 flex justify-center text-[18px] font-[500]">
              Your Orders
            </div>
            {orders.map((item) => (
              <>
                <hr className="border border-zinc-300 my-5"/>
                <div className=" flex justify-between">
                  <div className="flex gap-10">
                    <div className="h-[200px] w-[200px] bg-white">
                      <img
                        src={item.image}
                        style={{ height: "100%", width: "100%" }}
                        alt=""
                      />
                    </div>
                    <div class="flex flex-col gap-4">
                      <div class="flex flex-row justify-between">
                        <div class="flex flex-col">
                          <span class="text-xl font-[600]">
                            {item.brandname}
                          </span>
                          <p class="text-lg">{item.collectionname}</p>
                          <hr className="border border-zinc-300 my-3" />
                          <p className=" text-[16px]">colour : {item.color} </p>
                          <p className="text-[16px]">Size : {item.size}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-[500]">₹ {item.price}</p>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
