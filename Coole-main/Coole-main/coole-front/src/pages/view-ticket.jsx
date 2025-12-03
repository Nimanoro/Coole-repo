import { useState, useEffect } from "react";
import axios from "axios";
import { Paperclip, Send, ArrowRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewTicket() {
  const { ticketId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("loading"); // Open, Pending, Resolved, Closed
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTicket() {
      try {
        const response = await axios.get(`/api/support/ticket/${ticketId}`, {
          withCredentials: true,
        });
        setMessages(response.data.messages);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    }
    fetchTicket();
  }, [ticketId]);
  
  const sendMessage = () => {
    if (!input.trim() && !file) return;

    const newMessage = {
      text: input,
      file: file,
      sender: "user",
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setFile(null);
  };

  const handleSubmit = async () => {
    sendMessage();
    if (messages.length === 0) return;

    const formData = new FormData();
    formData.append("text", messages[messages.length - 1].text);
    formData.append("ticket_id", ticketId);
    if (messages[0].file) formData.append("file", messages[messages.length].file);

    try {
      await axios.post("/api/support/ticket/reply", formData, {
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

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm">
        <button onClick={() => navigate("/support")} className="p-2 bg-gray-100 rounded-full">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">مشاهده تیکت</h2>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      {/* Ticket Status */}
      <div className="px-4 py-2 text-sm text-center font-semibold">
        {status === "open" && <span className="text-orange-500">🟠 در حال بررسی</span>}
        {status === "pending" && <span className="text-blue-500">🔵 پاسخ داده شده</span>}
        {status === "resolved" && <span className="text-green-500">✅ حل شده</span>}
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
