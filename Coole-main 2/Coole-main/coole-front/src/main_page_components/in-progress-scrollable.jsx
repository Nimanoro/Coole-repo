import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import loc2 from "../assets/Icons/orangeloc.svg";

export default function InProgressTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await axios.get("/api/get-trips", { withCredentials: true });
        setTrips(inProgress || []);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    }
    fetchTrips();
  }, []);

  if (!trips.length) return null;

  return (
    <div className="mt-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="text-lg font-bold text-gray-900">برنامه‌های در حال اجرا</h2>
        <Link to="/trips/in-progress" className="text-green-700 text-sm font-semibold">
          مشاهده همه ←
        </Link>
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {trips.map((trip) => (
          <Link
            key={trip._id}
            to={`/trip/${trip._id}`}
            className="min-w-[260px] bg-white rounded-2xl shadow-md overflow-hidden flex-shrink-0"
          >
            {/* Image */}
            <div className="relative h-36">
              <img
                src={trip.images?.[0] || "/placeholder.jpg"}
                alt={trip.program_name}
                className="w-full h-full object-cover"
              />
              {/* Participants */}
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                {trip.participants || 0} نفر
              </div>
            </div>

            {/* Details */}
            <div className="p-3">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>{trip.schedule?.start_date?.substring(0, 10) || "تاریخ نامشخص"}</span>
                <span className="flex items-center gap-1 text-orange-600">
                  <img src={loc2} className="w-4 h-4" />
                  {trip.destination_city || "نامشخص"}
                </span>
              </div>
              <p className="font-bold text-gray-800">{trip.program_name}</p>
              <p className="text-green-600 font-bold mt-1 text-sm">
                {Number(trip.cost_per_person).toLocaleString()} تومان
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
