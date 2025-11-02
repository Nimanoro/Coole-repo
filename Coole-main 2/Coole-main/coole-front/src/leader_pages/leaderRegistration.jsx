import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TourLeaderRegistration() {
  const [profileImage, setProfileImage] = useState(null);
  const [nationalID, setNationalID] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [workPermit, setWorkPermit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch user data on mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`/api/getuser`, {
          withCredentials: true,
        });

        if (response.data.role !== "Leader") {
          setError("❌ You are not authorized to create a trip.");
          navigate("/dashboard"); // Redirect if not a leader
        }
      } catch (err) {
        setError("❌ Please log in first.");
        navigate("/login"); // Redirect to login if not authenticated
      }
    }
    fetchUserData();
  }, [navigate]);

  // ✅ Handle file selection
  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFile({ file, preview: URL.createObjectURL(file) }); // ✅ Store file & preview URL
    }
  };

  // ✅ Submit form data
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!profileImage || !nationalID || !insuranceFile || !workPermit) {
        alert("لطفاً تمام فایل‌های مورد نیاز را انتخاب کنید.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("profileImage", profileImage.file);
      formData.append("nationalID", nationalID.file);
      formData.append("insuranceFile", insuranceFile.file);
      formData.append("workPermit", workPermit.file);

      const response = await axios.post(`/api/leader-register`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },

      });
      alert("✅ ثبت نام با موفقیت انجام شد! منتظر تایید مدیر باشید.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Upload Error:", err);
      setError("❌ آپلود ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-100 p-4">
      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Container */}
      <div className="w-full max-w-md h-full flex flex-col justify-between overflow-auto bg-white rounded-lg shadow-lg p-4">
        
        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-black">ثبت نام کاربر تورلیدر</h1>
          <p className="text-gray-500 text-sm">لطفا اطلاعات تکمیلی خود را وارد کنید</p>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mt-2 w-full">
          <label className="relative cursor-pointer">
            <img
              src={profileImage?.preview || "/default-profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-orange-500 object-cover"
            />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e, setProfileImage)}
            />
          </label>
          <button className="mt-2 bg-black text-white px-4 py-2 rounded-md text-sm">
            تغییر تصویر پروفایل
          </button>
          <p className="text-gray-400 text-xs mt-1">حداکثر حجم برای هر فایل، 1 مگابایت</p>
        </div>

        {/* Upload Sections */}
        <div className="flex-1 overflow-auto w-full">
          {[
            { label: "تصویر کارت ملی", file: nationalID, setter: setNationalID },
            { label: "فایل مشخصات بیمه", file: insuranceFile, setter: setInsuranceFile },
            { label: "مجوز کار", file: workPermit, setter: setWorkPermit },
          ].map(({ label, file, setter }) => (
            <div key={label} className="mt-4 w-full bg-white p-4 rounded-lg shadow">
              <h2 className="text-right text-black font-semibold">{label}</h2>
              <div className="flex flex-col items-center border-dashed border-2 border-gray-300 p-4 mt-2 rounded-lg relative">
                {file ? (
                  <img src={file.preview} alt="Uploaded" className="w-full max-h-32 object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <span className="text-3xl">📤</span>
                    <p className="text-sm">تصویر {label} را انتخاب و آپلود کنید</p>
                    <p className="text-xs">حداکثر حجم برای هر فایل، 1 مگابایت</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, setter)}
                />
              </div>
              <button className="mt-2 w-full bg-black text-white py-2 rounded-md">
                انتخاب فایل ها
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button className="mt-4 w-full bg-orange-500 text-white py-3 rounded-full text-lg font-bold" 
          onClick={handleSubmit} disabled={loading}>
          {loading ? "در حال ارسال..." : "تکمیل ثبت نام"}
        </button>

      </div>
    </div>
  );
}
