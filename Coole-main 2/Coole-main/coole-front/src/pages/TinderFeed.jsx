import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { XCircle, Heart } from "lucide-react";

export default function TripSwipeFeed() {
  const [trips, setTrips] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await axios.get("/api/get-trips", {
          withCredentials: true,
        });
        setTrips(response.data || []);
      } catch (err) {
        console.error("❌ Unable to fetch trips.", err);
      }
    }
    fetchTrips();
  }, []);

  const handleLike = async () => {
    try {
      await axios.post(
        "/api/swipe/favorite",
        { tripId: trips[currentIndex]._id },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error logging like:", err);
    }
  
    nextCard();
  };
  
  const handleSkip = () => {
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < trips.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const currentTrip = trips[currentIndex];

  if (finished || trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center">
        <p className="text-gray-500 text-lg mb-6">🎉 همه برنامه‌ها را مرور کردی!</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition"
        >
          بازگشت به خانه
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      {/* Trip Card */}
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl overflow-hidden relative">
        <img
          src={currentTrip.images?.[0] || "/placeholder.jpg"}
          alt="Trip"
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">{currentTrip.program_name}</h2>
          <p className="text-sm text-gray-600 mb-2">
            مقصد: {currentTrip.destination_city || "نامشخص"}
          </p>
          <p className="text-sm text-gray-500">
            تاریخ: {currentTrip.schedule?.start_date?.substring(0, 10) || "نامشخص"}
          </p>
          <p className="text-green-600 font-semibold mt-2">
            هزینه: {currentTrip.cost_per_person?.toLocaleString() || 0} تومان
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-10 mt-8">
        <button
          className="p-4 bg-gray-200 text-gray-700 rounded-full shadow-md hover:bg-gray-300"
          onClick={handleSkip}
        >
          <XCircle className="w-8 h-8" />
        </button>
        <button
          className="p-4 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600"
          onClick={handleLike}
        >
          <Heart className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
