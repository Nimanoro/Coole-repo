import { useState, useEffect } from "react";
import axios from "axios";
import { Paperclip, Send, ArrowRight, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewTicketAdmin() {
  const { ticketId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("loading"); // Open, Pending, Resolved, Closed
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function fetchTicket() {
      try {
        const response = await axios.get(`/api/support/ticket/${ticketId}`, {
          withCredentials: true,
        });
        setMessages(response.data.messages);
        setUserId(response.data.user_id);
        setStatus(response.data.status);
        
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    }
    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    if (!userId) return;
    async function fetchUser() {
      try {
        const response = await axios.get(`/api/general-profile/${userId}`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [userId]); 
  
  const handleSubmit = async () => {
    if (!input.trim() && !file) return; // Prevent empty messages

      const newMessage = {
        text: input,
        file: file,
        sender: "admin",
        time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      };

    const updatedMessages = [...messages, newMessage]; // Add message to local state
    setMessages(updatedMessages);


    const formData = new FormData();
    formData.append("text", newMessage.text);
    formData.append("ticket_id", ticketId);
    if (newMessage.file) formData.append("file", newMessage.file);
    input && setInput("");
    setFile(null);

    try {
      await axios.post("/api/admin/ticket/reply", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };


  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(`/api/admin/ticket/status`, {ticket_id:ticketId,  status: newStatus }, { withCredentials: true });
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-white shadow-md">
      {/* Header */}

      <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
        <button onClick={() => navigate("/admin/tickets")} className="p-2 bg-gray-100 rounded-full">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">مشاهده تیکت</h2>
        <div className="w-8"></div> {/* Spacer */}
      </div>
      {/* User Info */}
      <div className="flex items-center gap-2 p-3">
        <img src={user.profilePicture} alt="user" className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <button className="text-xs text-blue-500" onClick={() => navigate(`/user-profile/${userId}`)}>مشاهده پروفایل</button>
        </div>
      </div>


      {/* Ticket Status */}
      <div className="flex justify-center gap-2 p-3">
        <button
          className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
            status === "open" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => updateStatus("open")}
        >
          <RefreshCw className="w-4 h-4" /> در حال بررسی
        </button>

        <button
          className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
            status === "pending" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => updateStatus("pending")}
        >
          <Clock className="w-4 h-4" /> پاسخ داده شده
        </button>

        <button
          className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
            status === "resolved" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => updateStatus("resolved")}
        >
          <CheckCircle className="w-4 h-4" /> حل شده
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg p-3 max-w-xs text-sm ${msg.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"}`}>
              {msg.text && <p>{msg.text}</p>}
              {msg.file && (
                <div className="mt-2">
                  {msg.file.startsWith("http") ? (
                    <img src={msg.file} alt="attachment" className="w-32 h-32 rounded-lg" />
                  ) : (
                    <p className="text-xs text-gray-300">📎 {msg.file.split("/").pop()}</p>
                  )}
                </div>
              )}
              <span className="text-xs opacity-50 mt-1 block text-left">{new Date(msg.timestamp).toLocaleTimeString("fa-IR")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      {status !== "closed" && (
        <div className="bg-gray-100 p-4 flex items-center border-t">
          <input type="file" id="fileUpload" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          <button className="p-2 bg-white rounded-full shadow-md" onClick={() => document.getElementById("fileUpload").click()}>
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>

          <input
            type="text"
            className="flex-1 mx-3 p-3 rounded-full bg-white border focus:outline-none text-black text-sm"
            placeholder="متن پیام..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />

          <button className="p-2 bg-green-600 text-white rounded-full shadow-md" onClick={handleSubmit}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
