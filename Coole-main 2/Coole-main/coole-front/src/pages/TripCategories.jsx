import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Eye, Heart, Filter, ArrowRight} from "lucide-react";
import {Link, useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import heart from "../assets/Icons/heart.svg";
import eye from "../assets/Icons/eye2.svg";
import loc from "../assets/Icons/loc.svg";
import loc2 from "../assets/Icons/orangeloc.svg";
import { TRIP_TYPES } from "../utils/tripTypes";
export default function TripCategories() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Add navigation hook
  const [sortBy, setSortBy] = useState("newest"); // ✅ Add sort state
  const Category = useParams().category;


  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/get-trips/`, {params: {category: Category, sortBy:sortBy}}, {
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

  if (loading) return <p className="text-center text-gray-600">🔄 در حال بارگیری...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4">

      <button className="bg-white p-2 rounded-full shadow-md" onClick={() => navigate("/dashboard")}>
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        {/* put trip persian category name here */}
        <h2 className="text-lg text-black font-bold">{Category}</h2>
        <button className="p-2 bg-gray-100 rounded-lg shadow-md">
          <Filter className="w-6 h-6 text-gray-600" />
        </button>


      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        
        <button className="w-[96px] h-[36px] bg-gray-100 text-gray-700 rounded-3xl shadow-md" onClick={() => setSortBy("closest")}>
          <div className="flex items-center justify-center h-full gap-2">
            <span className="inline-block relative top-[1px]">
            <img src={loc} alt="location icon" className="w-[16px] h-[16px]" />
            </span>
            <span className="text-sm leading-none">نزدیک‌ترین</span>
          </div>
        </button>
        <button className="w-[123px] h-[36px] bg-green-600 text-white rounded-3xl shadow-md" onClick = {() => setSortBy("mostViewed")}>
          <div className="flex items-center justify-center h-full gap-2">
            <span className="inline-block relative top-[1px]">
            <img src={eye} alt="eye icon" className="w-[14px] h-[14px]" />
            </span>
            <span className="text-sm leading-none">پر بازدیدترین‌ها</span>
          </div>
        </button>
        <button className="w-[110px] h-[36px] bg-gray-100 text-gray-700 rounded-3xl shadow-md "  onClick={() => setSortBy("mostLiked")}>
          <div className="flex items-center justify-center h-full gap-2">
            <span className="inline-block relative top-[1px]">
              <img src={heart} alt="heart icon" className="w-[14px] h-[14px]" />
            </span>
            <span className="text-sm leading-none">محبوب‌ترین</span>
          </div>
        </button>
      </div>

      {/* 🚀 Trips List */}
      <div className="space-y-6 overflow-y-auto">
        {trips.length === 0 ? (
          <p className="text-center text-gray-500">هیچ برنامه‌ای یافت نشد 🚀</p>
        ) : (
          trips.map((trip) => (
            <div key={trip._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Link to={`/trip/${trip._id}`} className="block">
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
                    {trip.participants ? Number(trip.participants) : 0} نفر
                  </div>
                  {/* Avatars */}
                  <div className="flex -space-x-2">
                    <img src={trip.leaderImage|| "/default-profile.png"} alt="Leader" className="w-8 h-8 rounded-full border-2 border-white" />
                  </div>
                </div>
              </div>
              
              {/* Trip Details */}
              {/* <div className="p-4">
                <p className="text-gray-500 text-sm">
                  {trip.schedule?.start_date ? trip.schedule.start_date.substring(0, 10) : "N/A"} 
                  {" - "} 
                  {trip.schedule?.end_date ? trip.schedule.end_date.substring(0, 10) : "N/A"}
                </p> */}

                <div className="p-4">
                  {/* Top Row: Location (left) + Start Date (right) */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 text-sm">
                      {trip.schedule?.start_date ? trip.schedule.start_date.substring(0, 10) : "N/A"}
                    </p>
                    <div className="flex items-center text-orange-600 text-sm">
                      <img src={loc2} alt="location icon" className="w-4 h-4" />
                      <span className="mr-1">{trip.destination_city || "نامشخص"}</span>
                    </div>
                  </div>

                {/* Trip Name */}
                <h3 className="text-lg font-bold text-gray-900 mt-1">{trip.program_name || "برنامه بدون نام"}</h3>

                {/* Destination */}
                {/* <div className="flex items-center text-orange-600 text-sm mt-2">
                  <MapPin className="w-4 h-4" />
                  <span className="ml-1">{trip.destination_city || "نامشخص"}</span>
                </div> */}

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
