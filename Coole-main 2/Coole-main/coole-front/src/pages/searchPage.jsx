import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TRIP_TYPES } from "../utils/tripTypes";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activity, setActivity] = useState(""); // ✅ Activity Selection State

    const navigate = useNavigate();

    useEffect(() => {
        fetchTrips();
    }, []);

    async function fetchTrips() {
        setLoading(true);
        try {
            const response = await axios.get(`/api/search-trips`, {
                params: { query, type, activity, minPrice, maxPrice, startDate, endDate },
            });
            setTrips(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen p-4 bg-gray-100">

            {/* 🔍 Search Box */}
            <div className="bg-white p-5 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">🔎 جستجوی سفر</h2>

                {/* 🔍 Search Bar */}
                <input
                    type="text"
                    placeholder="جستجوی نام یا مقصد..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-2 border text-black rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* 💰 Price Filters */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                        type="number"
                        placeholder="حداقل قیمت"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full p-2 border text-black rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="number"
                        placeholder="حداکثر قیمت"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full p-2 border text-black rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* 📅 Date Filters */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border rounded-md text-black focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border rounded-md text-black focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* 🏕️ Trip Type Selection (Scrollable Horizontal List) */}
               <div className="grid grid-cols-3 gap-2 mt-3">
                    {TRIP_TYPES.map((tripType) => (
                        <button
                            key={tripType.name}
                            onClick={() => setActivity(tripType.name)}
                            className={`flex items-center justify-center gap-1 p-2 rounded-lg text-sm font-medium transition ${
                                activity === tripType.name ? tripType.color: "bg-gray-200"
                            } 
                            ${activity === tripType.name ? "text-white" : "text-gray-800"}
                            }`}
                        >
                            {tripType.icon} {tripType.name}
                        </button>
                    ))}
                </div>

                {/* 🔎 Search Button */}
                <button
                    onClick={fetchTrips}
                    className="w-full bg-green-600 text-white p-2 rounded-md mt-4 text-lg font-semibold hover:bg-green-700 transition"
                >
                    جستجو
                </button>
            </div>
            
            {/* 🔎 Search Results */}
            <div className="mt-6">
                {loading && <p className="text-center text-gray-700">🔄 در حال بارگیری...</p>}
                {!loading && trips.length === 0 && (
                    <p className="text-center text-gray-500">🚀 هیچ سفری پیدا نشد</p>
                )}

                {/* 🏝️ Trip Cards */}
                <div className="grid gap-4">
                    {trips.map((trip) => (
                        <div
                            key={trip._id}
                            onClick={() => navigate(`/trip/${trip._id}`)}
                            className="bg-white p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition"
                        >
                            <img
                                src={trip.images?.[0] || "/placeholder.jpg"}
                                alt={trip.program_name}
                                className="w-20 h-20 rounded-md object-cover"
                            />
                            <div className="ml-3">
                                <h3 className="font-bold text-gray-800">{trip.program_name}</h3>
                                <p className="text-sm text-gray-600">{trip.destination_city}</p>
                                <p className="text-sm text-green-600">{trip.cost_per_person} تومان</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
