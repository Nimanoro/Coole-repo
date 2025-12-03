import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, Settings2 } from "lucide-react";
import loc2 from "../assets/Icons/orangeloc.svg";
//import { TRIP_TYPES } from "../utils/tripTypes";
import calendar from "../assets/Icons/Calendar.svg";
import home from "../assets/Icons/home.svg"
import search from "../assets/Icons/Search.svg"
import notification from "../assets/Icons/Notification.svg"
import mooshak from "../assets/Icons/mooshak.svg"
import travelerPic from "../assets/homepic.png"
import kooleguy from "../assets/kooleguy.png"
import beach from "../assets/Icons/beach.svg"
import city from "../assets/Icons/city.svg"
import desert from "../assets/Icons/desert.svg"
import camping from "../assets/Icons/camping.svg"
import jungle from "../assets/Icons/jungle.svg"
import mountains from "../assets/Icons/mountains.svg"
import offroad from "../assets/Icons/offroad.svg"
import stars from "../assets/Icons/stars.svg"
import rafting from "../assets/Icons/rafting.svg"
import squares from "../assets/Icons/squares.svg"
import plus from "../assets/Icons/plus.svg";

export const TRIP_TYPES = [
  { name: "ساحل", icon: beach, color: "#ECC16D26" },
  { name: "جنگل", icon: jungle, color: "#308C5521"},
  { name: "آفرود", icon: offroad, color: "#DE2A4B26" },
  { name: "رفتینگ", icon: rafting, color: "#6F7BE826" },
  { name: "کویری", icon: desert, color: "#FFAA8526" },
  { name: "نجومی", icon: stars, color: "#393D6426" },
  { name: "کمپینگ", icon: camping, color: "#D0464626" },
  { name: "کوه نوردی", icon: mountains, color: "#58B05626" },
  { name: "داخل شهر", icon: city, color: "#49AFA326" },
];

import { Link } from "react-router-dom";
export default function HomePage() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`/api/getUser`, {
          withCredentials: true,
        });
        setUser(response.data || null);
      } catch (err) {
        setError("❌ Unable to fetch user data.");
        navigate("/login");
      }
    }
    fetchUser();
  }, []);
  // Fetch trips
  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await axios.get(`/api/get-trips`, {
          withCredentials: true,
        });
        setTrips(response.data || []);
      } catch (err) {
        setError("❌ Unable to fetch trips.");
      }
    }
    fetchTrips();
  }, []);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await axios.get(`/api/favorites`, {
          withCredentials: true,
        });
        setFavorites(response.data || []);
      } catch (err) {
        setError("❌ Unable to fetch favorites.");
      }
    }
    fetchFavorites();
  }, []);

  return (

    <div className="flex flex-col items-center w-full h-screen bg-gray-100 overflow-hidden">
      <div className="overflow-y-auto w-full max-w-md flex-1 pb-28">
        <div className="bg-gray-10 rounded-lg w-full max-w-md mb-7">
        {/* Header */}
        <div className="relative w-full h-[200px] rounded-b-3xl overflow-hidden scrollbar-hide">
          <img
            src={travelerPic}
            alt="Header"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30">
            <h1 className="text-lg font-bold text-white mt-10">با کوله</h1>
            <p className="text-white text-2xl">آماده سفر با دوستات باش</p>
          </div>
          <div className="absolute top-5 left-4 flex gap-3">
            <button className="bg-white w-[46px] h-[46px] rounded-xl shadow-md flex items-center justify-center">
              <img src={mooshak} alt="mooshak" className="w-5 h-5" />
            </button>
            <button className="bg-white w-[46px] h-[46px] rounded-xl shadow-md flex items-center justify-center">
              <img src={notification} alt="notification" className="w-6 h-6" />
            </button>
          </div>

        </div>

      {/* In Progress Trips */}
      <div className="mt-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base text-black font-bold">برنامه های درحال اجرا</h2>
          <button onClick={() => navigate("/all-trips")} className="text-green-600 text-sm">
            مشاهده همه ←
          </button>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 w-max">
            {trips.slice(0, 5).map((trip) => (
                <div key={trip._id} className="w-[218px] h-[265px] bg-white rounded-2xl shadow-lg overflow-hidden flex-shrink-0">
                  <Link to={`/trip/${trip._id}`} className="block">
                  {/* Trip Image */}
                  <div className="relative">
                    <img 
                      src={trip.images?.length > 0 ? trip.images[0] : "/placeholder.jpg"} 
                      alt={trip.program_name || "برنامه بدون نام"} 
                      className="w-[218px] h-[139px] object-cover" 
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
    
                  <div className="p-4 text-right space-y-1">
                    {/* Date */}
                    <p className="text-gray-500 text-sm">
                      {trip.schedule?.start_date ? trip.schedule.start_date.substring(0, 10) : "تاریخ نامشخص"}
                    </p>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-900">
                      {trip.program_name || "برنامه بدون نام"}
                    </h3>

                    {/* Price */}
                    <p className="text-green-600 text-md font-bold">
                      {trip.cost_per_person ? Number(trip.cost_per_person).toLocaleString() : 0} تومان
                    </p>

                    {/* Location */}
                    <div className="flex justify-start items-center text-orange-600 text-sm">
                      <img src={loc2} alt="location icon" className="w-4 h-4" />
                      <span className="mr-1">{trip.destination_city || "نامشخص"}</span>
                    </div>
                  </div>
    
              </Link>
                </div>
            )
            )}
          </div>
        </div>
      </div>
      

      {/* Highlight Box Section */}
      <div className="mt-10 px-4 relative z-0">
        <div className="relative rounded-2xl bg-gradient-to-l from-[#FC5B29] via-[#DFBA68] to-[#1A773F] px-6 py-4 shadow-md flex items-center justify-between overflow-visible">
          
          {/* Text on the right */}
          <div className="text-white text-right space-y-1 z-10 pr-4 max-w-[60%]">
            <p className="text-sm font-medium">با کوله</p>
            <h3 className="text-xl font-extrabold">راحت برو سفر</h3>
            <p className="text-xs mt-1">لذت سفر واقعی رو با کوله تجربه کن!</p>
          </div>

          {/* Positioned image on the left */}
          <img
            src={kooleguy}
            alt="مسافر"
            className="absolute left-4 bottom-0 w-[112px] h-[134px] object-contain z-0"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-10 px-4">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-row gap-x-5 w-max">
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={() => navigate("/all-trips")}
              className="bg-black rounded-xl p-3 w-[44px] h-[44px] flex items-center justify-center hover:opacity-90 transition"
            >
              <img src={squares} alt="همه" className="w-6 h-6" />
            </button>
            <span className="text-sm text-black font-bold">همه</span>
          </div>
            {TRIP_TYPES.map((tripType) => (
              <div key={tripType.name} className="flex flex-col items-center space-y-1">
                <button
                  onClick={() => navigate(`/category/${tripType.name}`)}
                  style={{ backgroundColor: tripType.color }}
                  className="rounded-xl p-3 w-[44px] h-[44px] flex items-center justify-center hover:opacity-90 transition"
                >
                  <img src={tripType.icon} alt={tripType.name} className="w-6 h-6" />
                </button>
                <span className="text-sm text-black font-bold">{tripType.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Section */}
      <div className="mt-8 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base text-black font-bold">پیشنهادهای کوله</h2>
          <button className="text-sm" style={{ color: "#015B25" }}>مشاهده همه ←</button>
        </div>
        <div className="bg-white h-32 rounded-lg shadow-md flex items-center justify-center text-gray-400">
          Placeholder for suggested content ✅
        </div>
      </div>

      {/* Followed Trips Section */}
      <div className="mt-8 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base text-black font-bold">تورهای دنبال شده</h2>
          <button onClick={() => navigate("/all-trips")} className="text-green-600 text-sm">
            مشاهده همه ←
          </button>
        </div>

        <div className="space-y-4">
          {favorites.slice(0, 5).map((trip) => (
            <Link to={`/trip/${trip._id}`} key={trip._id} className="block">
              <div className="flex flex-row-reverse bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Left Side: Image */}
                <img 
                  src={trip.images?.[0] || "/placeholder.jpg"} 
                  alt={trip.program_name || "برنامه بدون نام"} 
                  className="w-[120px] h-[120px] object-cover rounded-l-2xl"
                />

                {/* Right Side: Info */}
                <div className="flex flex-col justify-between p-3 text-right w-full">
                  {/* Location */}
                  <div className="flex items-center text-orange-600 text-sm">
                    <img src={loc2} alt="location icon" className="w-4 h-4" />
                    <span className="mr-1">{trip.destination_city || "نامشخص"}</span>
                  </div>



                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1">
                    {trip.program_name || "برنامه بدون نام"}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {trip.description || "توضیحاتی برای این برنامه ثبت نشده است..."}
                  </p>

                  {/* Price */}
                  <p className="text-green-600 text-sm font-bold mt-2">
                    {trip.cost_per_person ? Number(trip.cost_per_person).toLocaleString() : 0} تومان
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
        </div>
      </div>
      
      {/* Check profile pic with nima later for backend pull */}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t p-3 flex justify-around shadow-md">
              {[
                { icon: <Settings2 /> || "/default-profile.png", path: "/dashboard" },
                { icon: calendar, path: "/calendar" },
                { icon: "+", path: "/trip-creation", center: true },
                { icon: search, path: "/search" },
                { icon: home, path: "/home" },
              ].map(({ icon, path, center }) => (
                <div 
                  key={path} 
                  onClick={() => navigate(path)} 
                  className={`p-3 ${center ? "bg-black text-white rounded-full w-12 h-12 flex items-center justify-center" : "text-gray-500"} transition hover:scale-105`}
                >
                  {/* For image icons */}
                  {typeof icon === 'string' && icon.includes('/default-profile.png') ? (
                    <img src={icon} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    typeof icon === 'string' && icon === "+" ? (
                      <button
                      type="button"
                      className="bg-black text-white w-11 h-11 rounded-full flex items-center justify-center"
                    >
                      <img src={plus} alt="Add Step" className="w-5 h-5" />
                    </button>             
                    ) : (
                      <img src={icon} alt="icon" className="w-6 h-6" />
                  )
                )}
                </div>
              ))}
      </div>
    </div>
  );
}