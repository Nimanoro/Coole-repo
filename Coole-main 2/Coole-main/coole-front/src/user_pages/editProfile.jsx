import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Camera, ArrowRight } from "lucide-react";
import edit2 from "../assets/Icons/edit2.svg"

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // Store file for upload
  const [previewImage, setPreviewImage] = useState(""); // Preview before upload
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  // 📌 Fetch user data on mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`/api/getUser`, {
          with: true,
        });

        setUser(response.data);
      } catch (err) {
        setError("❌ لطفاً ابتدا وارد شوید.");
        navigate("/login"); // Redirect to login if not authenticated
      }
    }
    fetchUserData();
  }, [navigate]);

  // 📌 Handle Image Selection & Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // Generate preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 📌 Handle Profile Update (Upload Image to Backend)
  const handleSave = async () => {
    try {
      if (!profileImage) return; // No new image selected

      const formData = new FormData();
      formData.append("profileImage", profileImage); // Attach file
    formData.append("description", description); // Attach description


      await axios.put(`/api/updateUserProfile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/dashboard"); // Redirect after saving
    } catch (err) {
      setError("❌ خطا در ذخیره تغییرات");
    }
  };

  if (!user) return <p className="text-center text-gray-600">🔄 در حال بارگیری...</p>;

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">

      {/* Page Title */}
      <div className="w-full max-w-md flex items-center justify-center py-4">
        <h1 className="text-lg font-bold text-gray-800">ویرایش پروفایل</h1>
      </div> 

      {/* Profile Image */}
      <div className="relative w-[84px] h-[84px] mt-6">
        <img
          src={previewImage || user?.profilePicture || "/default-profile.jpg"}
          alt="Profile"
          className="w-full h-full object-cover rounded-3xl border-4 border-orange-500"
        />
        <label className="absolute bottom-0 right-0 bg-orange-500 w-[28px] h-[28px] rounded-full cursor-pointer flex items-center justify-center">
          <img src={edit2} alt="Edit" className="w-[16px] h-[16px]" />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      <h2 className="text-xl font-bold mt-4">ویرایش پروفایل</h2>

      {/* Form Fields */}
      <div className="w-full max-w-md mt-6 space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1">نام شما:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-3xl p-3 text-sm bg-[#F4F8FA] text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1">آدرس ایمیل:</label>
          <input
            type="email"
            className="border border-gray-300 rounded-3xl p-3 text-sm bg-[#F4F8FA] text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 mb-1">شماره تلفن:</label>
          <input
            type="text"
            className="border border-gray-300 rounded-3xl p-3 text-sm bg-[#F4F8FA] text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Birthdate */}
      <div className="w-full max-w-md mt-6">
        <label className="text-gray-700 font-medium mb-2 block">تاریخ تولد</label>
        <div className="flex gap-3 justify-end">
          {/* Day */}
          <div className="w-20 bg-[#F4F8FA] text-black py-2 px-2 rounded-full flex items-center justify-between border border-gray-300">
            <input
              type="text"
              value={user?.birthDay || ""}
              onChange={(e) => setUser({ ...user, birthDay: e.target.value })}
              className="bg-transparent text-right w-10 outline-none"
            />
            <span className="text-xs text-gray-500 pr-1">روز</span>
          </div>

          {/* Month */}
          <div className="w-20 bg-[#F4F8FA] text-black py-2 px-2 rounded-full flex items-center justify-between border border-gray-300">
            <input
              type="text"
              value={user?.birthMonth || ""}
              onChange={(e) => setUser({ ...user, birthMonth: e.target.value })}
              className="bg-transparent text-right w-10 outline-none"
            />
            <span className="text-xs text-gray-500 pr-1">ماه</span>
          </div>

          {/* Year */}
          <div className="w-20 bg-[#F4F8FA] text-black py-2 px-2 rounded-full flex items-center justify-between border border-gray-300">
            <input
              type="text"
              value={user?.birthYear || ""}
              onChange={(e) => setUser({ ...user, birthYear: e.target.value })}
              className="bg-transparent text-right w-10 outline-none"
            />
            <span className="text-xs text-gray-500 pr-1">سال</span>
          </div>
        </div>
      </div>

      {/* Gender */}
      <div className="w-full max-w-md mt-6">
        <label className="text-gray-700 font-medium mb-2 block">جنسیت:</label>
        <div className="w-[255px] h-[36px] flex justify-between bg-[#F4F8FA] rounded-full overflow-hidden border border-gray-300 mx-auto">
          <button
            className={`w-1/2 h-full text-sm font-bold transition-all rounded-3xl ${
              user?.gender === "male" ? "bg-black text-white" : "text-gray-700"
            }`}
            onClick={() => setUser({ ...user, gender: "male" })}
          >
            مرد
          </button>
          <button
            className={`w-1/2 h-full text-sm font-bold transition-all rounded-3xl ${
              user?.gender === "female" ? "bg-black text-white" : "text-gray-700"
            }`}
            onClick={() => setUser({ ...user, gender: "female" })}
          >
            زن
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className="bg-orange-500 text-white text-lg font-semibold mt-6 px-16 py-3 rounded-full flex items-center gap-2"
        onClick={handleSave}
      >
        ذخیره تغییرات <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
