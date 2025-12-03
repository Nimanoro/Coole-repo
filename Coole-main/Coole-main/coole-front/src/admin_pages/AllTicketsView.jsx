import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAllTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");


    useEffect(() => {
        async function fetchTickets() {
            setLoading(true);
            try {
                const response = await axios.get(`/api/admin/tickets`, {
                    withCredentials: true,
                });
                setTickets(response.data);
            } catch (err) {
                setError("❌ Unable to fetch tickets.");
            } finally {
                setLoading(false);
            }
        }
        fetchTickets();
    }, [filter]);

    
    const filteredTickets =
    filter === "all" ? tickets : tickets.filter((ticket) => ticket.status === filter);
  return (
      <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-white shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
          <h2 className="text-lg font-semibold">🎫 درخواست‌های پشتیبانی</h2>
          <button onClick={() => navigate("/support/create")} className="p-2 bg-green-600 text-white rounded-lg flex items-center">
            <PlusCircle className="w-5 h-5 ml-2" /> درخواست جدید
          </button>
        </div>
        {/* Filter */}
        <div className="flex justify-center gap-2 p-3">
          <button
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              filter === "all" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("all")}
            >
              همه

          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              filter === "open" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("open")}
            >
              درحال بررسی

            
            </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("pending")}
            >
              پاسخ داده شده
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              filter === "resolved" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("resolved")}
            >
              حل شده
          </button>
      </div>            

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {loading ? (
            <p className="text-center">🔄 درحال بارگیری...</p>
          ) : filteredTickets.length === 0 ? (
            <p className="text-gray-500 text-center">❌ هیچ تیکتی ثبت نشده است.</p>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-gray-100 p-3 rounded-lg shadow-md mb-3 flex justify-between items-center cursor-pointer"
                onClick={() => navigate(`/admin/support/ticket/${ticket._id}`)}
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
