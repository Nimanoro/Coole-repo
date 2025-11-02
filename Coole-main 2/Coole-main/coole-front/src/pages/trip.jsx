import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapPin, Clock, Bus, Utensils, ShieldCheck, Home, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import nimaArrow from "../assets/Icons/arrowR.svg";
import save from "../assets/Icons/arianSave.svg";
export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        "%c🎨 Design by Arian %c| 🛠 Backend by Nima",
        "color: #015B25; font-weight: bold;",
        "color: #0077B6; font-weight: bold;"
      );
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    async function fetchTrip() {
      try {
        const response = await axios.get(`/api/get-trip/${id}`);
        setTrip(response.data);
      } catch (err) {
        setError("❌ خطا در بارگیری اطلاعات سفر");
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600">🔄 در حال بارگیری...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!trip) return <p className="text-gray-500 text-center">🚀 سفر یافت نشد</p>;
  const bookTrip = async () => {
    try {
      const response = await axios.post(`/api/book-trip/${id}`, {}, { withCredentials: true });
      alert("✅ سفر با موفقیت رزرو شد!");
    } catch (err) {
      alert("❌ خطا در رزرو سفر");

    }
  }
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md flex flex-col">
        
        {/* ✅ Fixed Header Image */}
        <div className="relative w-[375px] h-[332px] mx-auto flex-shrink-0">
          <img
            src={trip.images?.[0] || "/placeholder.jpg"}
            alt={trip.program_name}
            className="w-full h-full object-cover"
          />

          {/* Save - top left */}
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={() => console.log("💾 Trip saved!")}
              className="bg-white p-2 rounded-xl shadow-md"
              aria-label="ذخیره"
            >
              <img src={save} alt="save" className="w-6 h-6" />
            </button>
          </div>

          {/* Back - top right */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white p-2 rounded-xl shadow-md"
              aria-label="بازگشت"
            >
              <img src={nimaArrow} alt="back" className="w-6 h-6" />
            </button>
          </div>
        </div>

  
        {/* ✅ Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* ✅ Header: Name + Invite */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">{trip.program_name}</h1>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">دعوت کردن</button>
          </div>
          <p className="text-gray-600 mt-2">{trip.description.substring(0, 150)}...</p>
  
          {/* ✅ Trip Images Gallery */}
          {trip.images?.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto">
              {trip.images.slice(1, 4).map((img, index) => (
                <img key={index} src={img} alt="trip" className="w-24 h-24 rounded-lg object-cover shadow-md" />
              ))}
            </div>
          )}
  
          {/* ✅ Schedule */}
          <div className="mt-6 flex justify-between bg-gray-100 p-4 rounded-xl">
            <div className="text-center">
              <p className="text-gray-600">تاریخ رفت</p>
              <p className="font-semibold text-gray-800">{trip.schedule?.start_date?.substring(0, 10)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">تاریخ برگشت</p>
              <p className="font-semibold text-gray-800">{trip.schedule?.end_date?.substring(0, 10)}</p>
            </div>
          </div>
  
          {/* ✅ Travel Plan */}
          <h2 className="text-lg font-bold text-gray-800 mt-6">📍 برنامه سفر</h2>
          <div className="space-y-3 mt-2">
            {trip.steps?.length > 0 ? (
              trip.steps.map((step, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-lg flex items-center">
                  <img src={step.image} alt="step" className="w-12 h-12 rounded-lg object-cover shadow-md" />
                  <div className="ml-3">
                    <p className="font-bold text-gray-800">{step.description}</p>
                    <p className="text-sm text-gray-600">{step.details || "جزئیات ندارد"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">هیچ مرحله‌ای ثبت نشده است.</p>
            )}
          </div>
  
          {/* ✅ Travel Services */}
          <h2 className="text-lg font-bold text-gray-800 mt-6">📌 جزئیات و خدمات سفر</h2>
          <div className="space-y-3 mt-2">
            <div className="flex items-center text-gray-800">
              <Bus className="w-5 h-5 text-gray-600" />
              <span className="ml-2">{trip.services?.transportation || "نامشخص"}</span>
            </div>
            <div className="flex items-center text-gray-800">
              <Utensils className="w-5 h-5 text-gray-600" />
              <span className="ml-2">
                {trip.services?.meals?.breakfast || 0} صبحانه, {trip.services?.meals?.lunch || 0} ناهار, {trip.services?.meals?.dinner || 0} شام
              </span>
            </div>
            <div className="flex items-center text-gray-800">
              <ShieldCheck className="w-5 h-5 text-gray-600" />
              <span className="ml-2">{trip.services?.insurance || "بیمه ندارد"}</span>
            </div>
            <div className="flex items-center text-gray-800">
              <Home className="w-5 h-5 text-gray-600" />
              <span className="ml-2">{trip.services?.stay || "اقامت ندارد"}</span>
            </div>
          </div>
  
          {/* ✅ Location Map */}
          <h2 className="text-lg font-bold text-gray-800 mt-6">📌 محل و زمان بندی سفر</h2>
          <div className="bg-gray-100 p-4 rounded-lg mt-2 flex items-center">
            <MapPin className="text-orange-600 w-6 h-6" />
            <p className="text-gray-800 mt-1 ml-2">{trip.schedule?.location?.address || "آدرس مشخص نشده"}</p>
          </div>
  
          {/* ✅ Number of Participants */}
          <div className="bg-gray-100 p-4 rounded-lg mt-2 flex items-center">
            <p className="text-gray-800 mt-1 ml-2">تعداد شرکت کنندگان: {trip.participants.length}</p>
          </div>
  
          {/* ✅ Nima Guide */}
          <h2 className="text-lg font-bold text-gray-800 mt-6">📌 راهنمای تور</h2>
          <div className="flex items-center bg-gray-100 p-4 rounded-lg mt-2">
            <img src={trip.leaderImage} alt="guide" className="w-12 h-12 rounded-full object-cover shadow-md" />
            <div className="ml-4">
              <p className="font-bold text-gray-800">{trip.leaderName || "راهنمای نامشخص"}</p>
              <p className="text-gray-600">برنامه ریز سفر</p>
            </div>
            <button onClick={() => navigate(`/user-profile/${trip.leaderID}`)} className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg text-sm">مشاهده پروفایل</button>
          </div>
        </div>
  
        {/* ✅ Fixed Bottom Price & CTA */}
        <div className="w-full max-w-md mx-auto bg-white p-4 border-t shadow-lg flex justify-between items-center">
          <p className="text-xl font-bold text-green-600">
            {trip.cost_per_person?.toLocaleString()} تومان
          </p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg" onClick={() => bookTrip()}>
            شرکت کردن
          </button>
        </div>
      </div>
    </div>
  )};  