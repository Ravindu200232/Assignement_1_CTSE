import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageSlider from "../../components/imageSlider";
import { addToCart, LoadCart } from "../../utils/card";
import toast from "react-hot-toast";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import Footer from "../../components/footer";

export default function FoodItemOverview() {
  const { key } = useParams();
  const navigate = useNavigate();

  const [loadingStatus, setLoadingStatus] = useState("loading");
  const [foodItem, setFoodItem] = useState({});
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    // Fetch food item details
    axios
      .get(`http://localhost:3002/api/v1/collection/getOne/${key}`)
      .then((res) => {
        setFoodItem(res.data);
        setLoadingStatus("Loaded");
        console.log(res.data.restaurantId)

        // Fetch restaurant using restaurantId from food item
        if (res.data.restaurantId) {
          axios
            .get(
              `http://localhost:3002/api/v1/restaurant/getOne/${res.data.restaurantId}`
            )
            .then((restaurantRes) => setRestaurant(restaurantRes.data))
            .catch((err) => console.error("Failed to load restaurant", err));
        }

      })
      .catch((err) => {
        console.error(err);
        setLoadingStatus("error");
      });

    // Fetch reviews
    axios
      .get(`http://localhost:3002/api/v1/reviews/${key}`)
      .then((res) => {
        setReviews(res.data);
        console.log(res.data)
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const handleAddReview = async () => {
    setRefresh(false);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to submit a review.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3002/api/v1/reviews`,
        {
          productId: key,
          rating: userRating,
          comment: userComment,
          ownerId : restaurant.ownerId,
          restaurantName : restaurant.name,
          itemName : foodItem.name
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setReviews((prev) => [...prev, response.data]);
      setUserRating(0);
      setUserComment("");
      toast.success("Review submitted successfully.");
      setRefresh(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-primary text-white">
      {loadingStatus === "loading" && (
        <div className="border-b-4 w-[100px] h-[100px] my-4 border-b-accent rounded-full animate-spin"></div>
      )}

      {loadingStatus === "Loaded" && (
        <div className="w-full max-w-4xl p-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-4">
              <ImageSlider images={foodItem.images} />
            </div>

            <div className="md:w-1/2 p-4">
              <h1 className="text-3xl font-bold text-accent mb-4">
                {foodItem.name}
              </h1>
              <p className="text-xl mb-2">
                Price: Rs.{parseFloat(foodItem.price).toFixed(2)}
              </p>
              <p className="text-xl mb-2">
                Category: {foodItem.category || "Food"}
              </p>
              <p className="text-xl mb-2">
                Status:{" "}
                <span
                  className={`${
                    foodItem.available ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {foodItem.available ? "Available" : "Not Available"}
                </span>
              </p>
              <p className="text-xl mb-2">
                Description: {foodItem.description}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  addToCart(foodItem._id, 1);
                  toast.success("Added to Cart");
                  console.log(LoadCart());
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Restaurant Info Section */}
          {restaurant && (
  <div className="mt-10 p-4 bg-primary text-white rounded shadow flex flex-row gap-6">
    {/* Text Section */}
    <div className="flex-1">
      <h2 className="text-2xl font-bold mb-4">Served By</h2>
      <p className="text-lg mb-2">Name: {restaurant.name}</p>
      <p className="text-lg mb-2">Owner: {restaurant.ownerName}</p>
      <p className="text-lg mb-2">Address: {restaurant.address}</p>
      <p className="text-lg mb-4">Phone: {restaurant.phone}</p>
      <button
        className="px-4 py-2 bg-accent text-white rounded"
        onClick={() => {
          if (restaurant?._id) {
            navigate(`/restaurant/${restaurant._id}`, {
              state: { packageDetails: restaurant },
            });
          } else {
            toast.error("Restaurant details are not available.");
          }
        }}
      >
        View Restaurant Details
      </button>
    </div>

    {/* Image Section */}
    <div className="w-[400px] h-[250px] bg-white rounded overflow-hidden">
      {restaurant.images?.length > 0 ? (
        <img
          src={restaurant.images[0]}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-black">
          No Image Available
        </div>
      )}
    </div>
  </div>
)}


          {/* Review Section */}
          <div className="mt-16 p-4 bg-white text-black rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border p-4 rounded shadow bg-white text-black"
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={review.profilePicture}
                      alt={review.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.data).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Rating
                    style={{ maxWidth: 100 }}
                    value={review.rating}
                    readOnly
                  />
                  <p className="mt-2">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-6 text-black">
              <h3 className="text-xl font-bold mb-2">Write a Review</h3>
              <div className="mb-4">
                <Rating
                  style={{ maxWidth: 150 }}
                  value={userRating}
                  onChange={setUserRating}
                />
              </div>
              <textarea
                className="w-full border p-2 rounded mb-4 text-black"
                rows="4"
                placeholder="Write your experience here..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
              ></textarea>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAddReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {loadingStatus === "error" && (
        <div className="text-red-500 text-xl">
          Failed to load food details. Please try again later.
        </div>
      )}
      <Footer />
    </div>
  );
}
