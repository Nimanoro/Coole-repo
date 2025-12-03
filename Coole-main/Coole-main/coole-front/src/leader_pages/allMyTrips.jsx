import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Eye, Heart, Filter, ArrowRight} from "lucide-react";
import {Link} from "react-router-dom";

export default function AllLeaderTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isApproved, setIsApproved] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/get-leader-trips`, {
          withCredentials: true,
        });
        setTrips(response.data || []);
      } catch (err) {
        setError("❌ Unable to fetch trips.");
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) => trip.isApproved=== isApproved);
  if (loading) return <p className="text-center text-gray-600">🔄 در حال بارگیری...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-white p-4">


      {/* Header */}
        <div className="flex items-center justify-between py-4 w-full">
        <button className="bg-white p-2 rounded-full shadow-md">
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-lg font-bold text-black">برنامه های در حال اجرا</h2>
        </div>
        <div className="items-center flex gap-3 mb-4 w-full">
          <button className={`p-2 bg-gray-100 text-black rounded-lg shadow-md ${isApproved === true ? "bg-green-600": "bg-gray-100"}`} onClick={() => setIsApproved(true)}>
            برنامه های تایید شده
          </button>
          <button className={`p-2 bg-gray-100 text-black rounded-lg shadow-md ${isApproved === false ? "bg-green-600": "bg-gray-100"}`}onClick={() => setIsApproved(false)}>
            در انتظار تایید
          </button>
        </div>

      {/* 🚀 Trips List */}
      <div className="space-y-6">
        {filteredTrips.length === 0 ? (
          <p className="text-center text-gray-500">هیچ برنامه‌ای یافت نشد 🚀</p>
        ) : (
          filteredTrips.map((trip) => (
            <div key={trip._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Link to={`/leader-trip-details/${trip._id}`} className="block">
              {/* Trip Image */}
              <div className="relative">
                <img 
                  src={trip.images?.length > 0 ? trip.images[0] : "/placeholder.jpg"} 
                  alt={trip.program_name || "برنامه بدون نام"} 
                  className="w-full h-52 object-cover" 
                />
                <div className="absolute top-3 left-3 flex gap-2 items-center">
                  {/* Participants Count */}
                  <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow">
                    {trip.max_participants ? Number(trip.max_participants) : 0} نفر
                  </div>
                  {/* Avatars */}
                  <div className="flex -space-x-2">
                    <img src="/avatar1.png" className="w-8 h-8 rounded-full border-2 border-white shadow" />
                    <img src="/avatar2.png" className="w-8 h-8 rounded-full border-2 border-white shadow" />
                    <img src="/avatar3.png" className="w-8 h-8 rounded-full border-2 border-white shadow" />
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="p-4">
                <p className="text-gray-500 text-sm">
                  {trip.schedule?.start_date ? trip.schedule.start_date.substring(0, 10) : "N/A"} 
                  {" - "} 
                  {trip.schedule?.end_date ? trip.schedule.end_date.substring(0, 10) : "N/A"}
                </p>

                {/* Trip Name */}
                <h3 className="text-lg font-bold text-gray-900 mt-1">{trip.program_name || "برنامه بدون نام"}</h3>

                {/* Destination */}
                <div className="flex items-center text-orange-600 text-sm mt-2">
                  <MapPin className="w-4 h-4" />
                  <span className="ml-1">{trip.destination_city || "نامشخص"}</span>
                </div>

                {/* Cost */}
                <p className="text-green-600 text-md font-bold mt-2">
                  {trip.cost_per_person ? Number(trip.cost_per_person).toLocaleString() : 0} تومان
                </p>
              </div>

          </Link>
            </div>

          ))
        )}
      </div>
      
    </div>
  );
}
