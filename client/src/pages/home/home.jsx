import { MdMoney } from "react-icons/md";
import { BiDiamond } from "react-icons/bi";
import { AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./home.css";
import Footer from "../../components/footer";

export default function Home() {
  return (
    <div className="w-full h-screen bg-red-500 flex-col">
      {/* backdrop */}
      <div className="bg-black w-full md:h-[50%] relative">
        <div className="absolute right-[50%] bottom-[17%] text-secondary transform translate-x-[50%]">
          <Link
            to="/menu"
            className="bg-accent md:p-2 p-1 text-[10px] md:text-lg font-semibold hover:bg-purple-900 rounded-md text-primary"
          >
            View Menu
          </Link>
        </div>
      </div>

      {/* category */}
      <div className="text-secondary bg-primary w-full flex flex-col h-auto min-h-[900px]">
        <div className="flex justify-center items-center w-full h-[300px] flex-col text-center">
          <h1 className="text-4xl font-semibold w-[90%] md:w-[700px]">
            Craving something delicious?
          </h1>
          <h1 className="text-4xl font-semibold">Order your favorite meals now!</h1>
          <p className="text-xl">Here's what we serve</p>
        </div>

        <div className="flex flex-col md:flex-row w-full h-auto md:h-[600px] justify-center items-center">
          <div className="m-8 w-[90%] md:w-[400px]">
            <img src="./home1.jpg" className="rounded-lg w-full" />
            <div className="flex flex-col items-center text-center">
              <h1 className="font-semibold text-3xl">Fast Food</h1>
              <p>
                Burgers, fries, wraps, and more! Get your favorites delivered hot and fresh.
              </p>
              <Link
                className="bg-accent w-[100px] h-[40px] text-primary font-semibold flex justify-center items-center rounded-md mt-3"
                to="/menu"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="m-8 w-[90%] md:w-[400px]">
            <img src="./home2.jpg" className="rounded-lg w-full" />
            <div className="flex flex-col items-center text-center">
              <h1 className="font-semibold text-3xl">Family Meals</h1>
              <p>
                Delicious combo meals perfect for sharing with your family or friends.
              </p>
              <Link
                className="bg-accent w-[100px] h-[40px] text-primary font-semibold flex justify-center items-center rounded-md mt-3"
                to="/menu"
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="m-8 w-[90%] md:w-[400px]">
            <img src="./home3.jpg" className="rounded-lg w-full" />
            <div className="flex flex-col items-center text-center">
              <h1 className="font-semibold text-3xl">Desserts</h1>
              <p>
                Satisfy your sweet tooth with our delightful range of cakes, pastries, and ice creams.
              </p>
              <Link
                className="bg-accent w-[100px] h-[40px] text-primary font-semibold flex justify-center items-center rounded-md mt-3"
                to="/menu"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* poster2 */}
      <div className="w-full h-[300px] md:h-[400px] relative flex justify-center items-center flex-col">
        <img
          src="./poster2.jpg"
          className="w-full md:h-[500px] h-[400px] mt-[-8px] mb-[-5px] object-cover brightness-50 hover:blur-sm"
          alt="Food Delivery Support"
        />
        <div className="absolute flex items-center justify-center flex-col text-white text-center px-4">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Need food for a party or meeting?
          </h1>
          <p className="text-lg md:text-xl mt-2">
            We've got you covered with bulk ordering options and timely delivery.
          </p>
          <Link
            to="/order"
            className="bg-accent w-[120px] h-[40px] flex justify-center items-center rounded-md text-primary font-semibold mt-4"
          >
            Order Now
          </Link>
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full min-h-[500px] bg-primary flex flex-col justify-center items-center text-white p-6">
        <h1 className="text-3xl md:text-4xl font-semibold mt-6 text-center">
          Why choose FoodRush?
        </h1>
        <p className="text-base md:text-lg font-semibold text-center mt-2 px-4">
          Your hunger is our priority. We deliver fresh, hot meals to your doorstep.
        </p>
        <p className="text-base md:text-lg font-semibold text-center">
          Here’s what makes us special:
        </p>

        <div className="flex flex-col md:flex-row mt-8 w-full max-w-6xl">
          {/* Dependable */}
          <div className="flex flex-col w-full md:w-1/3 p-6 items-center ">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 flex flex-row items-center">
              <AiOutlineStar className="text-accent text-4xl mr-2" />
              Reliable Delivery
            </h1>
            <p>
              Count on us to bring your food right when you need it — hot, fresh, and fast.
            </p>
          </div>

          {/* Quality Food */}
          <div className="flex flex-col w-full md:w-1/3 p-6 items-center">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 flex flex-row items-center">
              <BiDiamond className="text-accent text-4xl mr-2" />
              Premium Quality
            </h1>
            <p>
              We use fresh ingredients and work with top chefs to bring you the best meals.
            </p>
          </div>

          {/* Affordable */}
          <div className="flex flex-col w-full md:w-1/3 p-6 items-center ">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4 flex flex-row items-center">
              <MdMoney className="text-accent text-4xl mr-2" />
              Great Value
            </h1>
            <p>
              Enjoy delicious meals at affordable prices — because good food shouldn’t break the bank.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Testimonials Section */}
      <div className="w-full min-h-[400px] flex flex-col items-center pt-10 bg-primary text-white px-6 text-center">
        <h2 className="text-lg md:text-xl font-semibold mb-6">
          See what our customers are saying.
        </h2>

        <div className="flex flex-col items-center max-w-3xl">
          <div className="text-4xl md:text-5xl border-2 w-14 h-14 flex justify-center items-center rounded-full mb-4">
            "
          </div>
          <p className="text-base md:text-lg">
            "The food was delivered on time and tasted amazing! It made our family dinner extra special. Highly recommended!"
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="w-full min-h-[300px] bg-blue-950 flex flex-col items-center justify-center text-white text-center px-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          Ready to order from FoodRush?
        </h1>
        <p className="text-base md:text-lg mb-6">
          Browse our menu or place your order now!
        </p>
        <Link
          to="/item"
          className="bg-accent px-6 py-3 rounded-md flex justify-center items-center text-black font-semibold hover:bg-purple-900 transition"
        >
          Order Now
        </Link>
      </div>

      <Footer />
    </div>
  );
}
