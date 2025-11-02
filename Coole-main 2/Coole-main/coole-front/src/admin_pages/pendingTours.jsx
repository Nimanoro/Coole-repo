import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPendingTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/pending-trips`, {
          withCredentials: true,
        });
        setTrips(response.data);
      } catch (err) {
        setError("❌ Unable to fetch pending trips.");
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  // ✅ Approve a trip
  const handleApprove = async (tripId) => {
    try {
      await axios.post(`/api/admin/approve-trip`, { tripId }, { withCredentials: true });
      setTrips(trips.filter((trip) => trip._id !== tripId)); // ✅ Remove from UI
      setSuccessMessage("✅ Trip approved successfully!");
    } catch (err) {
      console.error("Approval Error:", err);
      setError("❌ Failed to approve trip.");
    }
  };

  // ❌ Reject a trip
  const handleReject = async (tripId) => {
    try {
      await axios.post(`/api/admin/reject-trip`, { tripId }, { withCredentials: true });
      setTrips(trips.filter((trip) => trip._id !== tripId)); // ✅ Remove from UI
      setSuccessMessage("❌ Trip rejected successfully!");
    } catch (err) {
      console.error("Rejection Error:", err);
      setError("❌ Failed to reject trip.");
    }
  };

  if (loading) return <p className="text-center">🔄 Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl text-black font-bold text-center">📋 سفرهای در انتظار تأیید</h2>

        {/* ✅ Success Message Display */}
        {successMessage && <p className="text-green-600 text-center mt-2">{successMessage}</p>}

        {trips.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">✅ هیچ سفر جدیدی برای تأیید وجود ندارد.</p>
        ) : (
          trips.map((trip) => (
            <div key={trip._id} className="border rounded-lg p-3 mt-3 shadow-sm bg-gray-50 w-full">
              {/* ✅ User Info & Profile Image */}
              <div className="flex items-center gap-2">
                <img src={trip.images[0]} alt={trip.program_name} className="w-12 h-12 rounded-md object-cover" />
                <div className="flex-1">
                  <h3 className="text-black font-semibold">{trip.program_name}</h3>
                  <p className="text-black text-sm">{trip.destination_city}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-black text-sm font-medium">{trip.leaderName || "نام ناشناس"}</h3>
                  <img className="w-12 h-12 rounded-md object-cover" src={trip.leaderImage} alt="ایمیل ناموجود"/>
                </div>
              </div>

              {/* ✅ Approve & Reject Buttons */}
              
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleReject(trip._id)} className="bg-red-600 text-white py-2 rounded-md flex-1 text-sm">
                  ❌ رد سفر
                </button>
                <button onClick={() => handleApprove(trip._id)} className="bg-green-600 text-white py-2 rounded-md flex-1 text-sm">
                  ✅ تأیید سفر
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
