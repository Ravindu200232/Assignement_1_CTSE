import { MdDeleteForever } from "react-icons/md";
import { AiFillDownSquare } from "react-icons/ai";
import { AiFillUpSquare } from "react-icons/ai";
import axios from "axios";
import { useEffect, useState } from "react";
import { addToCart, removeFromCart } from "../utils/card";
import { FaArrowUp } from "react-icons/fa";

export default function BookingItem({ itemKey, qty, refresh }) {
  console.log("itemkey",itemKey);
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (status === "loading") {
      axios
        .get(`http://localhost:3002/api/v1/collection/getOne/${itemKey}`)
        .then((res) => {
          setItem(res.data);
          setStatus("success");
          console.log(res.data);
        })
        .catch(() => {
          console.log(err);
          setStatus("error");
          removeFromCart(itemKey);
          refresh();
        });
    }
  }, [status, itemKey, refresh]);

  if (status === "loading") {
    return;
  }

  if (status === "error") {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Failed to load item.
      </div>
    );
  }

  return (
    <div className="flex items-center p-4 bg-secondary rounded-lg shadow-md w-full mt-8 relative hover:bg-blue-200">
      <button
        className=" absolute right-[-40px] "
        onClick={() => {
          removeFromCart(itemKey);
          refresh();
        }}
      >
        <MdDeleteForever className="size-9 hover:text-red-800" />
      </button>
      <img
        src={item?.images[0]}
        alt={item?.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="ml-4 flex flex-row">
        <h3 className="text-lg font-semibold text-accent">{item?.name}</h3>
        <p className="text-sm text-gray-600 ml-7">{item?.description}</p>
        <p className="text-sm text-gray-700 font-medium ml-7">
          Price: {item?.price.toFixed}
        </p>
        <p className="text-sm text-gray-600 ml-7 relative flex items-center justify-center">
          <button
            className="absolute top-[-20px]"
            onClick={() => {
              addToCart(itemKey, 1);
              refresh();
            }}
          >
            <AiFillUpSquare className="size-5" />
          </button>
          {qty}
          <button
            className="absolute bottom-[-20px]"
            onClick={() => {
              if (qty == 1) {
                removeFromCart(itemKey);
                refresh();
              } else {
                addToCart(itemKey, -1);
                refresh();
              }

              refresh();
            }}
          >
            <AiFillDownSquare className="size-5" />
          </button>
        </p>

        <p className="text-sm text-gray-700 font-medium ml-7">
          Total Price : {(item?.price * qty).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
