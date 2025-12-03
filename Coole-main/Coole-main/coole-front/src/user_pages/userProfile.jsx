import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TRIP_TYPES } from "../utils/tripTypes";

export default function UserProfilePage() {
    const { id: userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get(`/api/general-profile/${userId}`);
                setUser(response.data);
            } catch (err) {
                setError("❌ خطا در بارگیری اطلاعات کاربر");
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [userId]);

    if (loading) return <p className="text-center text-gray-600">🔄 در حال بارگیری...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!user) return <p className="text-gray-500 text-center">🚀 کاربر یافت نشد</p>;

    return (

    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        
            {/* ✅ Profile Header */}
            <div className="relative h-[40vh] flex-shrink-0">
                <img
                    src={user.coverImage || "/default-cover.jpg"}
                    alt="Cover"
                    className="h-full object-cover rounded-b-3xl"
                />
                <button
                    className="bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition"
                    onClick={() => window.history.back()}
                >
                    ⬅
                </button>
            </div>
            <div className="flex justify-between items-center mt-4 px-4">

            {/* ✅ User Info */}
            <div className="flex flex-col items-center mt-[-40px]">
                <img
                    src={user.profilePicture || "/default-profile.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                />
                <h2 className="text-xl font-bold mt-2 text-gray-800">{user.name}</h2>
            </div>

            {/* ✅ About Section */}
            <div className="bg-white p-5 rounded-lg shadow-lg mt-4 mx-4">
                <h3 className="text-lg font-bold text-gray-800">درباره من</h3>
                <p className="text-gray-600 mt-2">{user.bio || "توضیحاتی موجود نیست"}</p>
            </div>

            {/* ✅ Interests (Preferred Trip Types) */}
            <div className="bg-white p-5 rounded-lg shadow-lg mt-4 mx-4">
                <h3 className="text-lg font-bold text-gray-800">موارد علاقه</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {user.preferredTripTypes?.length > 0 ? (
                        user.preferredTripTypes.map((type, index) => {
                            const tripType = TRIP_TYPES.find((t) => t.value === type) || {};
                            return (
                                <span
                                    key={index}
                                    className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${
                                        tripType.activeColor || "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    {tripType.icon} {tripType.name || type}
                                </span>
                            );
                        })
                    ) : (
                        <p className="text-gray-500">هیچ موردی انتخاب نشده است</p>
                    )}
                </div>
            </div>

            {/* ✅ Trips Joined */}
            <div className="bg-white p-5 rounded-lg shadow-lg mt-4 mx-4">
                <h3 className="text-lg font-bold text-gray-800">برنامه‌های وارد شده</h3>
                <div className="mt-2 space-y-2">
                    {user.travelHistory?.length > 0 ? (
                        user.travelHistory.map((trip, index) => (
                            <div
                                key={index}
                                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                onClick={() => navigate(`/trip/${trip._id}`)}
                            >
                                <img
                                    src={trip.image || "/default-trip.jpg"}
                                    alt="trip"
                                    className="w-16 h-16 rounded-md object-cover"
                                />
                                <div className="ml-3">
                                    <h4 className="font-bold text-gray-800">{trip.name}</h4>
                                    <p className="text-gray-600 text-sm">{trip.date}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">🚀 هیچ برنامه‌ای پیدا نشد</p>
                    )}
                </div>
            </div>

            {/* ✅ Favorites */}
            <div className="bg-white p-5 rounded-lg shadow-lg mt-4 mx-4">
                <h3 className="text-lg font-bold text-gray-800">برنامه‌های مورد علاقه</h3>
                <div className="mt-2 space-y-2">
                    {user.favorites?.length > 0 ? (
                        user.favorites.map((fav, index) => (
                            <div
                                key={index}
                                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                onClick={() => navigate(`/trip/${fav._id}`)}
                            >
                                <img
                                    src={fav.image || "/default-trip.jpg"}
                                    alt="trip"
                                    className="w-16 h-16 rounded-md object-cover"
                                />
                                <div className="ml-3">
                                    <h4 className="font-bold text-gray-800">{fav.name}</h4>
                                    <p className="text-gray-600 text-sm">{fav.date}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">❤️ هیچ مورد علاقه‌ای پیدا نشد</p>
                    )}
                </div>
            </div>

            {/* ✅ Add Friend Button */}
        </div>
        </div>
        </div>
    );
}
