import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPendingLeaders() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeaders() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/pending-leaders`, {
          withCredentials: true,
        });
        setLeaders(response.data);
      } catch (err) {
        setError("❌ Unable to fetch pending leaders.");
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  },[]);

  // ✅ Approve a Leader
  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/approve-leader/${id}`, {}, { withCredentials: true });
      setLeaders(leaders.filter((leader) => leader._id !== id)); // Remove from UI
    } catch (err) {
      console.error("Approval Error:", err);
      setError("❌ Failed to approve leader.");
    }
  };

  // ❌ Reject a Leader
  const handleReject = async (id) => {
    try {
      await axios.post(`/api/admin/reject-leader/${id}`, {}, { withCredentials: true });
      setLeaders(leaders.filter((leader) => leader._id !== id)); // Remove from UI
    } catch (err) {
      console.error("Rejection Error:", err);
      setError("❌ Failed to reject leader.");
    }
  };

  if (loading) return <p className="text-center">🔄 Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">📋 لیدرهای در انتظار تأیید</h2>
  
        {leaders.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">✅ هیچ لیدر جدیدی برای تأیید وجود ندارد.</p>
        ) : (
          leaders.map((leader) => (
            <div key={leader._id} className="border rounded-lg p-4 mt-4 shadow-md text-right">
              
              {/* User Info & Profile Image */}
              <div className="flex items-center gap-3">
                <img
                  src={leader.profileImage || "/default-profile.png"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{leader.user.name}</h3>
                  <p className="text-gray-600">📧 {leader.user.name}</p>
                  <p className="text-gray-600">📧 {leader.user.email}</p>
                  <p className="text-gray-600">📞 {leader.user.phone || "شماره تلفن ثبت نشده است"}</p>
                </div>
              </div>
  
              {/* Document Previews */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                {leader.nationalID && (
                  <div>
                    <p className="text-sm text-gray-500">📄 کارت ملی</p>
                    <a href={leader.nationalID} target="_blank" rel="noopener noreferrer">
                      <img src={leader.nationalID} alt="National ID" className="w-28 h-28 object-cover border rounded-md shadow-sm" />
                    </a>
                  </div>
                )}
                {leader.insuranceFile && (
                  <div>
                    <p className="text-sm text-gray-500">📜 بیمه</p>
                    <a href={leader.insuranceFile} target="_blank" rel="noopener noreferrer">
                      <img src={leader.insuranceFile} alt="Insurance" className="w-28 h-28 object-cover border rounded-md shadow-sm" />
                    </a>
                  </div>
                )}
                {leader.workPermit && (
                  <div>
                    <p className="text-sm text-gray-500">🛂 مجوز کار</p>
                    <a href={leader.workPermit} target="_blank" rel="noopener noreferrer">
                      <img src={leader.workPermit} alt="Work Permit" className="w-28 h-28 object-cover border rounded-md shadow-sm" />
                    </a>
                  </div>
                )}
              </div>
  
              {/* Approve & Reject Buttons */}
              <div className="mt-4 flex justify-between">
                <button onClick={() => handleApprove(leader._id)} className="bg-green-600 text-white py-2 px-4 rounded-md">
                  ✅ تأیید لیدر
                </button>
                <button onClick={() => handleReject(leader._id)} className="bg-red-600 text-white py-2 px-4 rounded-md">
                  ❌ رد لیدر
                </button>
              </div>
  
            </div>
          ))
        )}
      </div>
    </div>
  );
}