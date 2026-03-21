import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const bookingData = location.state?.sendData || [];
    setOrderItems(bookingData);
  }, [location.state]);

  if (!location.state || !location.state.sendData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Booking details not found.
      </div>
    );
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.totalAmount, 0);

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: {
        amount: totalAmount,
        bookingIds: orderItems.map((item) => item.orderId),
      },
    });
  };

  return (
    <div className="min-h-screen bg-primary text-primary p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-accent mb-6">Booking Confirmed</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl space-y-4">
        <p>
          <span className="font-bold">Email:</span> {orderItems[0]?.email}
        </p>
        <p>
          <span className="font-bold">Address:</span> {orderItems[0]?.address}
        </p>
        <p>
          <span className="font-bold">Total:</span> Rs. {totalAmount.toFixed(2)}
        </p>

        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Items Booked:</h2>
          <ul className="space-y-2">
            {orderItems.map((item, index) => (
              <li key={index} className="border rounded p-3 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.Item_name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.Item_name}</p>
                    <p>Order ID: {item.orderId}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: Rs. {item.price.toFixed(2)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleProceedToPayment}
          className="mt-6 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-dark transition"
        >
          Proceed to Payment
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-3 bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
