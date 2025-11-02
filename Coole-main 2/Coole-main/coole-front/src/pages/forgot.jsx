import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import waklkingDude from "../assets/guy.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`/api/forgot-password`, { email }, { withCredentials: true });

      setMessage("✅ لینک بازیابی رمز عبور ارسال شد.");
      setTimeout(() => navigate("/login"), 2000); // Wait 2 seconds before redirecting
    } catch (err) {
      setError(err.response?.data?.error || "❌ ارسال ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-6">
      
      {/* Signup Link */}
      <div className="w-full max-w-md flex flex-col items-start justify-start mb-4">
        <span className="text-gray-500 text-sm">حساب کاربری ندارید؟</span>
        <Link to="/signup" className="text-red-500 font-bold mt-1 text-sm underline">ثبت نام </Link>
      </div>

      {/* Image */}
      <img alt="Walking dude" src={waklkingDude} style={{ width: '400px', height: '156px' }} />

      <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-lg">

        {/* Title */}
        <h2 className="text-xl font-bold text-right mb-2 text-black">فراموشی رمز عبور</h2>
        <p className="text-xs text-right text-gray-500 mb-6">
          ایمیل خود را وارد کنید، ما لینک بازیابی رمز عبور را برای شما ارسال خواهیم کرد.
        </p>

        {/* Email Input */}
        <div className="relative mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-2 text-sm text-right">
            ایمیل:
          </label>
          <input
            id="email"
            type="email"
            className="w-full h-12 p-3 pl-10 border rounded-3xl bg-gray-100 text-center text-black"
            placeholder="ایمیل خود را وارد کنید"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 text-gray-500">📧</span>
        </div>

        {/* Display Errors or Success Messages */}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {message && <p className="text-green-500 text-center mb-3">{message}</p>}

        {/* Forgot Password Button */}
        <button
          onClick={handleForgotPassword}
          disabled={loading}
          style={{ backgroundColor: "#F36235" }}
          className="w-full text-white py-3 rounded-3xl text-lg font-bold"
        >
          {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
        </button>

        {/* Back to Login */}
        <div className="text-left mt-4">
          <Link to="/login" className="text-black text-sm underline">بازگشت به ورود</Link>
        </div>
      </div>
    </div>
  );
}
