import { useState } from "react";
import axios from "axios";
import { Paperclip, Send, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/Logo.png";

export default function CreateTicket() {
  const [messages, setMessages] = useState([
    { text: "سلام! چطور می‌توانم به شما کمک کنم؟", sender: "support", time: "14:25" }
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const sendMessage = () => {
    if (!input.trim() && !file) return;

    const newMessage = {
      text: input,
      file,
      sender: "user",
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!input.trim() && !file) return;

    sendMessage();

    const formData = new FormData();
    formData.append("text", input);
    if (file) formData.append("file", file);

    try {
      await axios.post("/api/support/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/support");
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-white shadow-md">
      {/* 🔹 Header */}
      <div className="flex flex-col items-center bg-green-500 justify-center py-3 border-b shadow-sm bg-white">
        {/* Back Button & Title */}
        <div className="flex items-center justify-between w-full px-4">
          <button onClick={() => navigate("/support")} className="p-2 bg-gray-100 rounded-full">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">پشتیبانی کوله</h2>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        {/* User Profile Section */}
        <div className="flex items-center mt-3 bg-green-500 text-white rounded-lg px-4 py-2 w-[90%]">
          <img src={logo} alt="user-logo" className="w-10 h-10 bg-white text-green-600 p-2 rounded-full" />
          <div className="ml-3">
            <p className="font-bold">نام کاربر</p>
            <p className="text-sm opacity-80">پشتیبانی آنلاین ●</p>
          </div>
        </div>
      </div>

      {/* 🔹 Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg p-3 max-w-xs text-sm ${msg.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"}`}>
              {msg.text && <p>{msg.text}</p>}
              {msg.file && (
                <div className="mt-2">
                  {msg.file.type.startsWith("image") ? (
                    <img src={URL.createObjectURL(msg.file)} alt="attachment" className="w-32 h-32 rounded-lg" />
                  ) : (
                    <p className="text-xs text-gray-300">📎 {msg.file.name}</p>
                  )}
                </div>
              )}
              <span className="text-xs opacity-50 mt-1 block text-left">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Input Field */}
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className="p-2 bg-green-600 text-white rounded-full shadow-md" onClick={handleSubmit}>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
