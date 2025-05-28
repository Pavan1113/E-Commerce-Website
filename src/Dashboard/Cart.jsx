import React, { useEffect, useState } from "react";

const Cart = () => {
  const initializeCartItems = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.map((item) => ({
      ...item,
      quantity: item.quantity || 1, // Set default quantity to 1 if not present
    }));
  };

  const [cartItems, setCartItems] = useState(initializeCartItems());
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("cartTab1");
  const [selectedPayment, setSelectedPayment] = useState(
    "Direct Bank Transfer"
  );

  // Purchase mode tracking
  const [purchaseMode, setPurchaseMode] = useState("all"); // "all", "selected", "single"
  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Handle individual item purchase
  const handleBuyNow = (index) => {
    const singleItem = cartItems[index];

    setPurchaseMode("single");
    setCheckoutItems([singleItem]);
    setActiveTab("cartTab2");
  };

  // Handle checkbox selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle bulk purchase
  const handleBulkPurchase = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one product");
      return;
    }

    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    setPurchaseMode("selected");
    setCheckoutItems(selectedProducts);
    setActiveTab("cartTab2");
  };

  // Remove item from cart
  const removeItem = (index) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);

    // Remove from selected items if it was selected
    const removedItemId = cartItems[index].id;
    setSelectedItems((prev) => prev.filter((id) => id !== removedItemId));
  };

  // Update quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 20) {
      const updatedItems = cartItems.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
    }
  };

  // Calculate totals based on checkout items
  const calculateTotals = (items) => {
    const subtotal = items.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
    const shipping = items.length > 0 ? 5 : 0;
    const vat = items.length > 0 ? 11 : 0;
    const total = subtotal + shipping + vat;

    return { subtotal, shipping, vat, total };
  };

  // Get current totals based on purchase mode
  const getCurrentTotals = () => {
    if (purchaseMode === "single" || purchaseMode === "selected") {
      return calculateTotals(checkoutItems);
    }
    return calculateTotals(cartItems);
  };

  const { subtotal, shipping, vat, total } = getCurrentTotals();

  // Handle tab navigation
  const handleTabClick = (tab) => {
    if (tab === "cartTab1") {
      setActiveTab(tab);
      setPurchaseMode("all");
      setCheckoutItems([]);
    } else if (tab === "cartTab2") {
      if (cartItems.length > 0) {
        setActiveTab(tab);
        if (purchaseMode === "all") {
          setCheckoutItems(cartItems);
        }
      }
    } else if (tab === "cartTab3") {
      if (checkoutItems.length > 0 || cartItems.length > 0) {
        setActiveTab(tab);
      }
    }
  };

  // Handle proceed to checkout (for all items)
  const handleProceedToCheckout = () => {
    setPurchaseMode("all");
    setCheckoutItems(cartItems);
    setActiveTab("cartTab2");
  };

  // Generate order number
  const orderNumber = Math.floor(Math.random() * 100000);

  // Format current date
  const currentDate = new Date();
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>

        {/* Tab Navigation */}
        <div className="flex flex-col md:flex-row justify-center mb-8 space-y-2 md:space-y-0 md:space-x-4">
          <button
            className={`flex items-center p-4 rounded-lg border-2 transition-all ${
              activeTab === "cartTab1"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600"
            }`}
            onClick={() => handleTabClick("cartTab1")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                01
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Shopping Bag</h3>
                <p className="text-sm opacity-75">Manage Your Items List</p>
              </div>
            </div>
          </button>

          <button
            className={`flex items-center p-4 rounded-lg border-2 transition-all ${
              activeTab === "cartTab2"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600"
            } ${cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            // onClick={() => handleTabClick("cartTab2")}
            disabled={cartItems.length === 0}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                02
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Shipping and Checkout</h3>
                <p className="text-sm opacity-75">Checkout Your Items List</p>
              </div>
            </div>
          </button>

          <button
            className={`flex items-center p-4 rounded-lg border-2 transition-all ${
              activeTab === "cartTab3"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600"
            } ${cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            // onClick={() => handleTabClick("cartTab3")}
            disabled={cartItems.length === 0}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                03
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Confirmation</h3>
                <p className="text-sm opacity-75">
                  Review And Submit Your Order
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg">
          {/* Tab 1: Shopping Bag */}
          {activeTab === "cartTab1" && (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="border border-gray-200 rounded-lg">
                    <div className="p-6 border-b">
                      <h2 className="text-2xl font-semibold">Shopping Cart</h2>
                      <div className="flex justify-end">
                        <span className="text-gray-600">Price</span>
                      </div>
                    </div>

                    <div className="p-6">
                      {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500 text-lg">
                            No items selected
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cartItems.map((item, index) => (
                            <div
                              key={item.id}
                              className="border-b pb-6 last:border-b-0"
                            >
                              <div className="flex gap-4">
                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() =>
                                      toggleItemSelection(item.id)
                                    }
                                    className="mt-2 w-4 h-4 text-blue-600 rounded"
                                  />
                                </div>

                                <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={
                                      item.image ||
                                      "https://via.placeholder.com/200"
                                    }
                                    alt={item.brandname}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h3 className="text-xl font-semibold">
                                      {item.brandname}
                                    </h3>
                                    <p className="text-lg text-gray-600">
                                      {item.collectionname}
                                    </p>
                                  </div>

                                  <div className="flex gap-1">
                                    {/* Star rating */}
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <span
                                          key={i}
                                          className={`text-[20px] ${
                                            i < 4
                                              ? "text-orange-400"
                                              : "text-gray-300"
                                          }`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-1 text-gray-600">
                                    <p>Colour: {item.color}</p>
                                    <p>Size: {item.size}</p>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">
                                      Quantity:
                                    </span>
                                    <div className="flex items-center border rounded-lg">
                                      <button
                                        onClick={() =>
                                          updateQuantity(
                                            index,
                                            (item.quantity || 1) - 1
                                          )
                                        }
                                        className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
                                        disabled={(item.quantity || 1) <= 1}
                                      >
                                        −
                                      </button>
                                      <input
                                        type="number"
                                        value={item.quantity || 1}
                                        onChange={(e) =>
                                          updateQuantity(
                                            index,
                                            parseInt(e.target.value) || 1
                                          )
                                        }
                                        className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                                        min="1"
                                        max="20"
                                      />
                                      <button
                                        onClick={() =>
                                          updateQuantity(
                                            index,
                                            (item.quantity || 1) + 1
                                          )
                                        }
                                        className="p-2 hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
                                        disabled={(item.quantity || 1) >= 20}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleBuyNow(index)}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                      Buy Now
                                    </button>
                                    <button
                                      onClick={() => removeItem(index)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <p className="text-xl font-semibold">
                                    ₹{" "}
                                    {(
                                      item.price * (item.quantity || 1)
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {cartItems.length > 0 && (
                        <div className="mt-6 text-center">
                          <button
                            onClick={handleBulkPurchase}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                          >
                            Buy Selected Items
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cart Totals */}
                {cartItems.length > 0 && (
                  <div className="lg:w-80">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Cart Totals
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>
                            ₹{calculateTotals(cartItems).subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>
                            ₹{calculateTotals(cartItems).shipping.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>VAT</span>
                          <span>
                            ₹{calculateTotals(cartItems).vat.toFixed(2)}
                          </span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>
                            ₹{calculateTotals(cartItems).total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleProceedToCheckout}
                        className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Checkout */}
          {activeTab === "cartTab2" && (
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">
                    Billing Details
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="border rounded-lg p-3"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="border rounded-lg p-3"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Company Name (optional)"
                      className="w-full border rounded-lg p-3"
                    />
                    <select className="w-full border rounded-lg p-3">
                      <option>Country / Region</option>
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Street Address*"
                      className="w-full border rounded-lg p-3"
                    />
                    <input
                      type="text"
                      placeholder="Town / City *"
                      className="w-full border rounded-lg p-3"
                    />
                    <input
                      type="text"
                      placeholder="Postcode / ZIP *"
                      className="w-full border rounded-lg p-3"
                    />
                    <input
                      type="text"
                      placeholder="Phone *"
                      className="w-full border rounded-lg p-3"
                    />
                    <input
                      type="email"
                      placeholder="Your Mail *"
                      className="w-full border rounded-lg p-3"
                    />
                    <textarea
                      placeholder="Order Notes (Optional)"
                      rows={4}
                      className="w-full border rounded-lg p-3"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-6">Your Order</h3>
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div className="space-y-2">
                      <div className="mb-2 text-sm text-gray-600">
                        {purchaseMode === "single" && "Single Item Purchase"}
                        {purchaseMode === "selected" &&
                          "Selected Items Purchase"}
                        {purchaseMode === "all" && "All Cart Items"}
                      </div>
                      {checkoutItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.brandname} x {item.quantity || 1}
                          </span>
                          <span>
                            ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <hr />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>₹{shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT</span>
                        <span>₹{vat.toFixed(2)}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mt-6">
                      <h4 className="font-semibold">Payment Method</h4>
                      {[
                        "Direct Bank Transfer",
                        "Check Payments",
                        "Cash on delivery",
                        "Paypal",
                      ].map((method) => (
                        <label
                          key={method}
                          className="flex items-start space-x-3"
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method}
                            checked={selectedPayment === method}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="mt-1"
                          />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>

                    <button
                      onClick={() => handleTabClick("cartTab3")}
                      className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Confirmation */}
          {activeTab === "cartTab3" && (
            <div className="p-6 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-green-600 mb-2">
                    Your order is completed!
                  </h2>
                  <p className="text-gray-600">
                    Thank you. Your order has been received.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Order Number</p>
                    <h4 className="font-semibold">{orderNumber}</h4>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Date</p>
                    <h4 className="font-semibold">{formatDate(currentDate)}</h4>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Total</p>
                    <h4 className="font-semibold">₹{total.toFixed(2)}</h4>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Payment Method</p>
                    <h4 className="font-semibold">{selectedPayment}</h4>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Order Details</h3>
                  <div className="space-y-2">
                    {checkoutItems.map((item) => {
                      console.log(checkoutItems);
                      return (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.brandname} x {item.quantity || 1}
                          </span>
                          <span>
                            ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <hr className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT</span>
                      <span>₹{vat.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  // Replace the existing "Continue Shopping" button onClick handler with this:

                  onClick={() => {
                    // Remove purchased items from cartItems
                    const purchasedItemIds = checkoutItems.map(
                      (item) => item.id
                    );
                    const remainingCartItems = cartItems.filter(
                      (item) => !purchasedItemIds.includes(item.id)
                    );

                    // Update cart state
                    setCartItems(remainingCartItems);

                    // Reset other states
                    setActiveTab("cartTab1");
                    setSelectedItems([]);
                    setPurchaseMode("all");
                    setCheckoutItems([]);
                  }}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
