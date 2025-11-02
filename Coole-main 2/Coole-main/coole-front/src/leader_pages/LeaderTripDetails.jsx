import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function LeaderTripDetailsPage() {
    const { id: tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

      async function onlyLeader() {
        try {
          const response = await axios.get(`/api/only-leader/${tripId}`, {
            withCredentials: true,
          });
          if (response.status >= 400) {
            navigate("/dashboard");
          }
        } catch (err) {
          console.error("Leader check failed:", err);
          setError("دسترسی محدود شده است!");
        }
      }
      
      onlyLeader();
    }, [tripId, navigate]);


    useEffect(() => {
      async function fetchTrip() {
        try {
          const response = await axios.get(`/api/get-trip/${tripId}`);
          setTrip(response.data);
        } catch (err) {
          setError("❌ خطا در بارگیری اطلاعات سفر");
        } finally {
          setLoading(false);
        }
      }
      fetchTrip();
    }, [tripId]);


    useEffect(() => {
        async function fetchParticipants() {
            try {
                const response = await axios.get(`/api/get-participants/${tripId}`, {
                  withCredentials: true,
                });
                setParticipants(response.data);
            } catch (err) {
                setError("❌ خطا در بارگیری اطلاعات شرکت‌کنندگان");
            }
        }
        fetchParticipants();
    }
    , [tripId]);


    if (loading) return <p className="text-center text-gray-600">🔄 در حال بارگیری...</p>
    if (error) return <p className="text-red-500 text-center">{error}</p>
    if (!trip) return <p className="text-gray-500 text-center">🚀 سفر یافت نشد</p>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* ✅ Fixed Header Image */}
          <div className="relative w-full h-[40vh] sm:h-[50vh] flex-shrink-0">
            <img
              src={trip.images?.[0] || "/placeholder.jpg"}
              alt={trip.program_name}
              className="w-full h-full object-cover rounded-b-3xl"
            />
            {/* 🔙 Back Button */}
            <button className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-md" onClick={() => window.history.back()}>
              ⬅
            </button>
          </div>
      
          {/* ✅ Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-20 max-w-lg mx-auto w-full">
            {/* ✅ Header: Name + Invite */}
            <div className="flex justify-between items-center mt-4">
              <h1 className="text-2xl font-bold text-gray-800">{trip.program_name}</h1>
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
                    <img src="/placeholder.jpg" alt="step" className="w-12 h-12 rounded-lg object-cover shadow-md" />
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

            {/* number of participants */}
            <div className="bg-gray-100 p-4 rounded-lg mt-2 flex items-center">
            <p className="text-gray-800 mt-1 ml-2">تعداد شرکت کنندگان
            {trip?.participants?.length || 0} نفر
            </p>
            </div>
          {participants.length === 0 ? (
            <div className="text-center text-gray-600">بدون شرکت کننده</div>
          ) : (
            <div className="space-y-4">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg shadow-sm">
                  <img 
                    src={participant.profileImage || "/default-profile.png"} 
                    alt="participant" 
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                  />
                  <p className="text-gray-800 ml-3">{participant.name}</p>
                </div>
              ))}
            </div>
          )}


          
        </div>
          <div className="w-full max-w-lg mx-auto bg-white p-4 border-t shadow-lg flex justify-between items-center">
            <p className="text-xl font-bold text-green-600">
              {trip.cost_per_person?.toLocaleString()} تومان
            </p>
          {/*  edit button */}
          <button className="bg-green-600 text-white p-3 rounded-full shadow-lg" onClick={() => navigate(`/edit-trip/${tripId}`)}>
            ویرایش
          </button>
      
      </div>


      
</div>
      
      );
    }  