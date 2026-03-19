import { useEffect, useState } from "react";
import { LoadCart } from "../../utils/card";
import BookingItem from "../../components/bookingitem";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function BookingPage() {
  const [cart, setCart] = useState(LoadCart());
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  function reloadCart() {
    setCart(LoadCart());
    calculateTotal();
  }

  function calculateTotal() {
    const cartInfo = LoadCart();
    console.log(cartInfo)
    axios
      .post(`http://localhost:3001/api/v1/orders/quote`, cartInfo)
      .then((res) => {
        console.log(res.data.orderItem);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.log(err);
      });

      console.log("cartsssssssssss",LoadCart())
  }

  useEffect(() => {
    calculateTotal();
  }, []);

  function handleBookingCreation() {
    const cart = LoadCart();
    console.log("load" ,LoadCart())   

    const token = localStorage.getItem("token");
    console.log(token)
    axios
      .post(`http://localhost:3001/api/v1/orders`, cart, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res",res.data.orders)
        const sendData = res.data.orders;
        localStorage.removeItem("cart");
        toast.success("Booking Created");
        setCart(LoadCart());
        if (res.data) {
          navigate("/bookingconfirmation", {
            state: { sendData },
          });
        } else {
          toast.error("Invalid booking details received.");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.success("Please Login");
      });
  }

 

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-primary p-6">
      <h1 className="text-3xl font-bold text-accent mb-6">Cart Page</h1>

      {/* Date Inputs */}
      

      {/* Booking Items */}
      <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
        {cart.orderItem.length > 0 ? (
          cart.orderItem.map((item) => (
            <div key={item.key} className="w-full   rounded-lg ">
              <BookingItem
                itemKey={item.key}
                qty={item.qty}
                refresh={reloadCart}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        )}
      </div>

      <div className="w-full flex justify-center mt-4 flex-col items-center">
        <p className="text-accent font-semibold mb-3">
          Total : {total.toFixed(2)}
        </p>
        <button
          className="bg-accent text-white px-4 py-2 rounded-md"
          onClick={handleBookingCreation}
        >
          Create order
        </button>

        

        <button 
          className="bg-accent text-white px-4 py-2 rounded-md fixed bottom-10 right-10"
          onClick={()=>{
            navigate("/location")
          }}
        >
          Update order address
        </button>
      </div>
    </div>
  );
}
