import { Link, Route, Routes } from "react-router-dom";
import Header from "../../components/header";
import Contact from "./contacts";
import Item from "./item";
import Home from "./home";
import ErrorNotFound from "./error";
import Footer from "../../components/footer";
import ProductOverview from "./productOverview";
import { BookingPage } from "./bookingpage";
import { Profile } from "./profile";
import RestaurantDetails from "./restaurantDetails";
import Restaurant from "./restaurant";
import { Location } from "./location";

export default function HomePage() {
  return (
    <div className="w-screen h-screen flex flex-col ">
      <header className="fixed top-0 w-full z-10 shadow-lg shadow-black">
        <Header />
      </header>
      <div className="flex-grow  mt-16  bg-primary ">
        <Routes path="/*">
          <Route path="/contact" element={<Contact />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/item" element={<Item />} />
          <Route path="/product/:key" element={<ProductOverview />} />
          <Route path="/cart" element={<BookingPage />} />
          <Route path="/location" element={<Location/>}/>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<ErrorNotFound />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/restaurant/*" element={<RestaurantDetails/>} />
        </Routes>
      </div>
    </div>
  );
}
