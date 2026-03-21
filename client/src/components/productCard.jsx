import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  const fallbackImage = "/default-food.jpg";
  const imageUrl = item.images?.[0] || fallbackImage;

  return (
    <div className="w-[200px] h-[320px] rounded-xl overflow-hidden shadow-md bg-primary p-3 hover:shadow-lg transition duration-300">
      {/* Product Image */}
      <img
        className="w-full h-[150px] object-cover rounded-md"
        src={imageUrl}
        alt={item.name}
      />

      {/* Product Info */}
      <div className="mt-3">
        <h2 className="text-sm font-semibold text-white truncate">
          {item.name}
        </h2>
        <p className="text-xs text-white truncate">
          {item.category?.toUpperCase() || "UNCATEGORIZED"}
        </p>

        <p className="mt-1 text-sm font-bold text-green-500">
          Rs.{parseFloat(item.price).toFixed(2)}
        </p>

        <p
          className={`text-xs font-semibold ${
            item.available ? "text-green-400" : "text-red-400"
          }`}
        >
          {item.available ? "Available" : "Not Available"}
        </p>

        {/* View Details Button */}
        <div className="mt-3">
          <Link
            to={`/product/${item._id}`}
            className="block text-center px-3 py-1 text-xs font-semibold text-black bg-accent rounded-md hover:bg-accent-dark transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
