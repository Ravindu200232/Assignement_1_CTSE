import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";
import Footer from "../../components/footer";

export default function Item() {
  const [state, setState] = useState("loading"); // loading, success, error
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilters, setCategoryFilters] = useState([]);

  useEffect(() => {
    if (state === "loading") {
      axios
        .get(`http://localhost:3002/api/v1/collection`)
        .then((res) => {
          const allItems = res.data;
          setItems(allItems);
          setFilteredItems(allItems);
          setState("success");
           console.log(res)
        })
       
        .catch((err) => {
          toast.error(err?.response?.data?.error || "An error occurred");
          setState("error");
        });
    }
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterItems(value, categoryFilters);
  };

  // Handle Checkbox Filters (only "audio" and "lights")
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    const updatedFilters = checked
      ? [...categoryFilters, value]
      : categoryFilters.filter((category) => category !== value);

    setCategoryFilters(updatedFilters);
    filterItems(searchTerm, updatedFilters);
  };

  // Filter Logic
  const filterItems = (searchValue, selectedCategories) => {
    let filtered = items;

    if (searchValue) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchValue)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category?.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  return (
    <div className="w-full min-h-screen mt-[20px] bg-primary text-white">
      {/* Search & Filter Section */}
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-[40%] p-2 border border-gray-300 rounded-md outline-none text-black"
          />

          {/* Static Filter Options */}
          <div className="flex gap-6 mt-3 md:mt-0">
            {/* fastfood Checkbox */}
            <label className="flex items-center space-x-2 cursor-pointer text-white">
              <input
                type="checkbox"
                value="fastfood"
                onChange={handleFilterChange}
                className="w-5 h-5 rounded-md border-2 border-gray-400 accent-green-500 transition-all duration-200 hover:scale-110"
              />
              <span className="text-lg">Fast Food</span>
            </label>

            {/* familyMeals Checkbox */}
                  <label className="flex items-center space-x-2 cursor-pointer text-white">
                    <input
                    type="checkbox"
                    value="familymeals"
                    onChange={handleFilterChange}
                    className="w-5 h-5 rounded-md border-2 border-gray-400 accent-green-500 transition-all duration-200 hover:scale-110"
                    />
                    <span className="text-lg">Family Meal</span>
                  </label>

                  {/* dessert Checkbox */}
            <label className="flex items-center space-x-2 cursor-pointer text-white">
              <input
                type="checkbox"
                value="dessert"
                onChange={handleFilterChange}
                className="w-5 h-5 rounded-md border-2 border-gray-400 accent-green-500 transition-all duration-200 hover:scale-110"
              />
              <span className="text-lg">Dessert</span>
            </label>
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <div className="w-full max-w-6xl mx-auto flex flex-wrap justify-center gap-4 pb-10">
        {state === "loading" && (
          <div className="w-full flex justify-center items-center">
            <div className="w-[50px] h-[50px] border-4 border-t-green-500 animate-spin rounded-full"></div>
          </div>
        )}

        {state === "success" && filteredItems.length === 0 && (
          <p className="text-gray-300 text-center w-full">No items found.</p>
        )}

        {state === "success" &&
          filteredItems.map((item) => (
            <div key={item._id || item.key}>
              <ProductCard item={item} />
            </div>
          ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
