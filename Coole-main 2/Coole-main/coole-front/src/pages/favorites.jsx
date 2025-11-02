import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserInterests() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Available categories (Use `value` for state tracking)


  // ✅ Toggle selection (Fix: Use `value` instead of `name`)
  const toggleInterest = (value) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // ✅ Save interests & navigate
  const handleSave = async () => {
    if (selectedInterests.length === 0) {
      alert("لطفاً حداقل یک موضوع انتخاب کنید.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/api/users/interests`, { interests: selectedInterests }, { withCredentials: true });
      navigate("/dashboard"); // Redirect to main page
    } catch (err) {
      alert("❌ خطا در ذخیره علایق. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-6">
      <h2 className="text-xl font-bold">انتخاب موضوعات موردعلاقه</h2>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {categories.map(({ name, icon, color, value }) => (
          <button
            key={value}
            onClick={() => toggleInterest(value)} // ✅ FIXED: Using `value`
            className={`w-40 py-3 rounded-xl text-white flex items-center justify-center space-x-2 
              transition-all duration-200 ease-in-out 
              ${selectedInterests.includes(value) ? color : "bg-gray-200 text-gray-700"}`}
          >
            <span>{icon}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full max-w-xs bg-orange-500 text-white py-3 rounded-full text-lg font-bold 
          hover:bg-orange-600 transition-all duration-200"
        disabled={loading}
      >
        {loading ? "در حال ذخیره..." : "هدایت به صفحه اصلی"}
      </button>
    </div>
  );
}
