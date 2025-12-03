import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      try {
        const response = await axios.get("/api/support/tickets",  { withCredentials: true });
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
      setLoading(false);
    }
    fetchTickets();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
        <h2 className="text-lg font-semibold">🎫 درخواست‌های پشتیبانی</h2>
        <button onClick={() => navigate("/support/create")} className="p-2 bg-green-600 text-white rounded-lg flex items-center">
          <PlusCircle className="w-5 h-5 ml-2" /> درخواست جدید
        </button>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading ? (
          <p className="text-center">🔄 درحال بارگیری...</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-500 text-center">❌ هیچ تیکتی ثبت نشده است.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-gray-100 p-3 rounded-lg shadow-md mb-3 flex justify-between items-center cursor-pointer"
              onClick={() => navigate(`/support/ticket/${ticket._id}`)}
            >
              <div>
                <p className="text-black font-bold">📩 {ticket.messages[0]?.text?.substring(0, 30)}...</p>
                <p className="text-sm text-orange-500">{new Date(ticket.created_at).toLocaleString("fa-IR")}</p>
              </div>
              <div>
                {ticket.status === "open" && <div> <Clock className="text-orange-500 w-5 h-5 items-center" /> <span className="text-orange-500">در حال بررسی</span> </div>}
                {ticket.status === "pending" && <div> <MessageSquare className="text-blue-500 items-center w-5 h-5" /> <span className="text-blue-500">پاسخ داده شده</span> </div>}
                {ticket.status === "resolved" && <div> <CheckCircle className="text-green-500 items-center w-5 h-5" /> <span className="text-green-500">حل شده</span> </div>}
                {ticket.status === "closed" && <div> <XCircle className="text-red-500 w-5 h-5 items-center" /> <span className="text-red-500">بسته شده</span> </div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
