import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import luggage from "../assets/luggage.png";
import EditIcon from "../assets/Icons/edit.svg";
import TripsIcon from "../assets/Icons/mountain.svg";
import FriendsIcon from "../assets/Icons/friends.svg";
import SettingsIcon from "../assets/Icons/setting.svg";
import SupportIcon from "../assets/Icons/contactus.svg";
import LockIcon from "../assets/Icons/lock.svg";
import LogoutIcon from "../assets/Icons/logout.svg";
import calendar from "../assets/Icons/Calendar.svg";
import home from "../assets/Icons/home.svg"
import search from "../assets/Icons/Search.svg"

export default function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`/api/getUser`, {
          withCredentials: true,
        });

        const userData = response.data;
        setUser(userData);
        if (response.data.role === "Leader" && response.data.leaderDetails?.isApproved === false && response.data.leaderDetails?.submited === false) {
          navigate("/leader-registration"); // Redirect if leader is unverified
        }
        if (response.data.role === "User" && response.data.preferences.preferredTripTypes.length === 0) {
          navigate("/interests"); // Redirect if user hasn't selected interests
        }

      } catch (err) {
        setError("❌ Please log in first.");
        navigate("/login"); // Redirect to login if not authenticated
      }
    }
    fetchUserData();
  }, [navigate]); // ✅ Don't include `user` in dependencies to avoid infinite re-renders

  const handleLogout = async () => {
    try {
      await axios.post(`/api/logout`, {}, { withCredentials: true });
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError("❌ Logout failed.");
    }
  };

  if (!user) return <p className="text-center">🔄 Loading...</p>;
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      {/* Profile Header */}
      <div className="relative w-full max-w-md bg-gradient-to-r from-[#FA8966] to-[#F36235] rounded-b-3xl p-6 flex items-center justify-between">
        {/* Left-Side Image */}
        <img 
          src={luggage}  // Change path if needed
          alt="Decorative"
          className="w-[104px] h-[92px] object-contain absolute left-4 top-1/2 transform -translate-y-1/2"  // Adjust width & add spacing
        />
        <div className="flex items-center">
          <img 
            src={user.profilePicture || "/default-profile.png"} 
            alt="Profile" 
            className="w-16 h-16 rounded-xl border-2 border-white object-cover"
          />
          <div className="ml-4">
            <h2 className="text-white text-lg font-bold">{user.name}</h2>
            <p className="text-white text-sm">{user.role === "Leader" ? "ماجراجو" : "کاربر عادی"}</p>
          </div>
        </div>
      </div>
  
      {/* Dashboard List */}
      <div className="w-full max-w-md mt-6 flex-1 px-4 bg-gray-100">
        {[
          { label: "ویرایش پروفایل کاربری", desc: "تصویر پروفایل، نام و ...", icon: EditIcon, path: "/edit-profile" },
          { label: "تورها و برنامه های شما", desc: "لیست برنامه‌های شما", icon: TripsIcon, path: "/my-trips" },
          { label: "لیست دوستان", desc: "لیست همسفران من", icon:FriendsIcon, path: "/friends" },
          { label: "تنظیمات", desc: "برنامه را شخصی سازی کنید", icon: SettingsIcon, path: "/settings" },
          { label: "ارتباط با پشتیبانی", desc: "مشکلات خود را گزارش کنید", icon: SupportIcon, path: "/support" },
          { label: "تغییر رمز عبور", desc: "رمز عبور خود را تغییر دهید", icon: LockIcon, path: "/forgot" },
          { label: "خروج از حساب", desc: "به طور کامل از حساب خارج شوید", icon: LogoutIcon, path: "/", action: handleLogout },
        ].map(({ label, desc, icon, path, action }) => (
          <div 
            key={label} 
            onClick={() => action ? action() : navigate(path)}
            className="flex items-start p-4 border-b cursor-pointer hover:bg-gray-100 transition"
            //className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-100 transition"
          >
            {/* Small Icon Box */}
            <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-xl">
            <img src={icon} alt="icon" className="w-9 h-9" />
            </div>
            <div className="ml-6 flex-1">
              <h3 className="text-black font-bold leading-tight">{label}</h3>
              <p className="text-gray-500 text-sm mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>
  
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t p-3 flex justify-around shadow-md">
        {[
          { icon: user.profilePicture || "/default-profile.png", path: "/dashboard" },
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
              <div className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center">
                <span className="text-3xl">+</span>
                </div>              
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