import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import walkingDude from "../assets/guy3.png";
import eyee from "../assets/Icons/eye.svg";
import noEye from "../assets/Icons/noEye.svg";
import phone from "../assets/Icons/mobile.svg";
import emailIcon from "../assets/Icons/sms.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("normal"); // "normal" or "tour-leader"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleLogin = async () => {
    setLoading(true);
    setError("");
  try {

    const response = await axios.post(`/api/signin`, {
      email: email,
      password: password,
    }, 
    { withCredentials: true }
  );
  console.log("Backend Response:", response.data);
  navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.error || "❌ ورود ناموفق بود.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">

      {/* Signup text block with horizontal padding */}
      <div className="px-4 pb-2">
        <div className="w-full max-w-md flex flex-col items-end justify-start mt-4 mb-4 mx-auto text-right">
          <span className="text-gray-500 text-base font-bold">حساب کاربری ندارید؟</span>
          <Link to="/signup" className="text-red-500 font-bold mt-1 text-base underline underline-offset-2">ثبت نام </Link>
        </div>
      </div>

      {/* Full-width image block with no padding */}
      <div>
        <img src={walkingDude} className="w-full h-auto" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 top-[280px] overflow-y-auto bg-white px-6 pt-8 pb-10 rounded-t-3xl shadow-2xl z-10">

        {/* Title by Nima */}
        <h2 className="text-xl font-bold text-right mb-2 text-black">ورود به حساب</h2>
        <p className="text-xs text-right text-gray-500 mb-6">
          برای ورود به حساب خود اطلاعات خود را وارد کنید
        </p>

        {/* User Type Label */}
          <p className="text-base text-gray-600 text-right mb-2">نوع حساب:</p>

        {/* User Type Selection */}
        <div className="flex justify-between bg-gray-200 p-1 rounded-3xl mb-4">
          <button
            className={`flex-1 py-2 rounded-3xl text-lg ${
              userType === "normal" ? "bg-black text-white" : "text-gray-500"
            }`}
            onClick={() => setUserType("normal")}
          >
            کاربر عادی
          </button>
          <button
            className={`flex-1 py-2 rounded-3xl text-lg ${
              userType === "tour-leader" ? "bg-black text-white" : "text-gray-500"
            }`}
            onClick={() => setUserType("tour-leader")}
          >
            کاربر تورلیدر
          </button>
        </div>

        {/* email Input */}
        <div className="relative mb-4">
        <label htmlFor="email" className="block text-gray-600 mb-2 text-base text-right">
           آدرس ایمیل: 
          </label>
          <input
            id="email"
            type="email"
            className="w-full h-12 p-3 pl-10 border rounded-3xl bg-gray-100 text-center text-black"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="absolute p-1 left-3 top-1/2 text-gray-500">
            <img src={emailIcon} alt="nima email" className="w-5 h-5"/>
          </span>
        </div>

        {/* Password Input */}
        <div className="relative mb-2">
        <label htmlFor="password" className="block text-gray-600 mb-2 text-base text-right">
          رمز عبور: 
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full p-3 pl-10 border rounded-3xl bg-gray-100 text-center text-black"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute p-1 left-3 top-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img src={showPassword ? noEye : eyee} alt="Nima ramzo neshoon nade" className="w-5 h-5" />
          </span>
        </div>

        {/* Forgot Password */}
        <div className="text-left mb-6">
          <button on onClick={() => navigate("/forgot")} className="text-black text-sm underline underline-offset-4">فراموشی رمز عبور</button>
        </div>

        {/* Display Errors */}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {/* Login Button (Connected to Backend) */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{backgroundColor: "#F36235"}} 
          className="w-full mt-1 text-white py-3 rounded-3xl text-lg font-bold"
        >
          {loading ? "در حال ورود..." : "ورود به حساب"}
        </button>

        {/* Email Login Option */}
        <button
          className="w-full mt-3 text-[#606671] py-3 rounded-3xl text-lg font-bold"
        >
          ورود از طریق شماره تلفن 
        </button>

      </div>
    </div>
  );
}
