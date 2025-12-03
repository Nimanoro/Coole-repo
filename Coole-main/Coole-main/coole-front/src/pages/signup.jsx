import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import eyee from "../assets/Icons/eye.svg";
import noEye from "../assets/Icons/noEye.svg";
import phone from "../assets/Icons/mobile.svg";
import email from "../assets/Icons/sms-tracking.svg";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDay: "1",
    birthMonth: "2",
    birthYear: "2",
    password: "",
    confirmPassword: "",
    userType: "User",
    gender: "",

  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("⚠️ رمز عبور مطابقت ندارد!");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const response = await axios.post(`/api/signup`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
        password: formData.password,
        role: formData.userType,
      });

      console.log("Backend Response:", response.data);
      if (response.status === 201) {
        localStorage.setItem("email", formData.email); // ✅ Store email for verification step
        navigate("/verify");
      } else {
        setError("❌ Token missing in response!");
      }
    } catch (err) {
      setError(err.response?.data?.error || "❌ ثبت نام ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      
      {/* Login Link */}
      <div className="px-4 pb-2">
        <div className="w-full flex flex-col items-start justify-start mt-4 mb-4 px-4 text-left" dir="ltr">
          <span className="text-gray-500 text-base font-bold">حساب کاربری دارید؟</span>
          <Link to="/login" className="text-red-500 font-bold text-base underline underline-offset-2">
            ورود به حساب
          </Link>
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-t-3xl shadow-2xl mt-2">
        

        {/* Title */}
        <h2 className="text-xl font-bold text-right text-black">ثبت نام در کوله</h2>
        <p className="text-right text-gray-500 mb-6 text-sm">برای ثبت نام اطلاعات خود را وارد کنید</p>

        {/* User Type Selection */}
        <label className="block text-right text-gray-600 mb-1">نوع حساب:</label>
        <div className="flex gap-2 bg-gray-200 p-1 rounded-3xl mb-4">
          <button
            className={`flex-1 py-2 rounded-3xl text-base ${
              formData.userType === "User" ? "bg-black text-white" : "text-gray-500"
            }`}
            onClick={() => setFormData({ ...formData, userType: "User" })}
          >
            کاربر عادی
          </button>
          <button
            className={`flex-1 py-2 rounded-3xl text-base ${
              formData.userType === "Leader" ? "bg-black text-white" : "text-gray-500"
            }`}
            onClick={() => setFormData({ ...formData, userType: "Leader" })}
          >
            کاربر تورلیدر
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-right text-gray-600">نام و نام خانوادگی:</label>
            <input
              type="text"
              name="name"
              className="w-full p-3 bg-gray-100 rounded-3xl text-center focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="نام و نام خانوادگی"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4 relative">
            <label className="block text-right text-gray-600">آدرس ایمیل:</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 bg-gray-100 rounded-3xl text-center focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="ایمیل"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span className="absolute left-3 top-1/2 text-gray-500">
              <img src={email} alt="email Icon" className="w-5 h-5"/>
            </span>
          </div>

          {/* Phone Number Input */}
          <div className="mb-4 relative">
            <label className="block text-right text-gray-600">شماره تلفن:</label>
            <input
              type="tel"
              name="phone"
              className="w-full p-3 bg-gray-100 rounded-3xl text-center focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="شماره تلفن"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <span className="absolute left-3 top-1/2 text-gray-500">
              <img src={phone} alt="phone Icon" className="w-5 h-5"/>
            </span>
          </div>
          
          {/* User Gender Selection */}
          <label className="block text-right text-gray-600 mb-1">جنسیت:</label>
          <div className="flex justify-between bg-gray-200 p-1 rounded-3xl mb-4">
            <button
              type="button"
              className={`flex-1 py-2 rounded-3xl text-base ${
                formData.gender === "male" ? "bg-black text-white" : "text-gray-500"
              }`}
              onClick={() => setFormData({ ...formData, gender: "male" })}
            >
              مرد 
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-3xl text-base ${
                formData.gender === "female" ? "bg-black text-white" : "text-gray-500"
              }`}
              onClick={() => setFormData({ ...formData, gender: "female" })}
            >
              زن 
            </button>
          </div>

          {/* Birth Date Selection */}
          {/* <div className="mb-4">
            <label className="block text-right text-gray-600 text-black">تاریخ تولد:</label>
            <div className="flex justify-between text-center">

              <select
                name="birthDay"
                className="p-3 bg-gray-100 rounded-3xl text-center text-black text-xs"
                value={formData.birthDay}
                onChange={handleChange}
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                name="birthMonth"
                className="w-1/3 p-3 bg-gray-100 rounded-3xl text-center text-black text-xs"
                value={formData.birthMonth}
                onChange={handleChange}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select
                name="birthYear"
                className="w-1/3 p-3 bg-gray-100 rounded-3xl text-center text-black text-xs"
                value={formData.birthYear}
                onChange={handleChange}
              >
                {[...Array(100)].map((_, i) => (
                  <option key={i} value={1300 - i}>{1403 - i}</option>
                ))}
              </select>
              
              
            </div>
          </div> */}

          {/* Birthdate */}
          <div className="w-full max-w-md mb-6" dir="rtl">
            <label className="text-gray-700 font-medium mb-2 block">تاریخ تولد</label>
            <div className="flex gap-2 justify-end w-full">
              {/* Day */}
              <div className="flex-1 max-w-[120px] bg-[#F4F8FA] text-black py-2 px-6 rounded-full flex items-center justify-between border border-gray-300">
                <input
                  type="text"
                  value={formData.birthDay}
                  onChange={handleChange}
                  className="bg-transparent text-right w-full outline-none pr-1"
                />
                <span className="text-base text-gray-500 pr-1">روز</span>
              </div>

              {/* Month */}
              <div className="flex-1 max-w-[120px] bg-[#F4F8FA] text-black py-2 px-6 rounded-full flex items-center justify-between border border-gray-300">
                <input
                  type="text"
                  value={formData.birthMonth}
                  onChange={handleChange}
                  className="bg-transparent text-right w-full outline-none pr-1"
                />
                <span className="text-base text-gray-500 pr-1">ماه</span>
              </div>

              {/* Year */}
              <div className="flex-1 max-w-[120px] bg-[#F4F8FA] text-black py-2 px-6 rounded-full flex items-center justify-between border border-gray-300">
                <input
                  type="text"
                  value={formData.birthYear}
                  onChange={handleChange}
                  className="bg-transparent text-right w-full outline-none pr-1"
                />
                <span className="text-base text-gray-500 pr-1">سال</span>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6 relative">
            <label className="block text-right text-gray-600">رمز عبور:</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full p-3 bg-gray-100 rounded-3xl text-center focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="رمز عبور"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="absolute left-3 top-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img src={showPassword ? noEye : eyee} alt="Toggle Password Visibility" className="w-5 h-5" />
            </span>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6 relative">
            <label className="block text-right text-gray-600"> تکرار رمز عبور:</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="w-full p-3 bg-gray-100 rounded-3xl text-center focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="تکرار رمز عبور"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="absolute left-3 top-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <img src={showConfirmPassword ? noEye : eyee} alt="Toggle Password Visibility" className="w-5 h-5" />
            </span>
          </div>

          {/* Sign-Up Button */}
          <button
            type="submit"
            style={{backgroundColor: "#F36235"}}
            className="w-full bg-red-500 text-white py-3 rounded-3xl text-lg font-bold"
            disabled={loading}
          >
            ثبت نام
          </button>
        </form>
      </div>
    </div>
  );
}
