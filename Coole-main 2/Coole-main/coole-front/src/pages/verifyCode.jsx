import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyCode() {
    const navigate = useNavigate();
    const [email, setEmail] = useState(localStorage.getItem("email") || ""); // ✅ Load stored email
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const[resendLoading, setResendLoading] = useState(false);
    const [message, setMessage] = useState("");
    const handleVerify = async () => {
        if (code.length !== 6) {
            setError("❌ Verification code must be 6 digits.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");
        
        try {
            const response = await axios.post("/api/verify", { email, code }, { withCredentials: true });
            setMessage(response.data.message);
            if (response.status === 200) localStorage.removeItem("email"); // ✅ Remove stored email
            setTimeout(() => navigate("/dashboard"), 1000); // Redirect after success
        } catch (err) {
            setError(err.response?.data?.error || "❌ Invalid verification code.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setError("");
        setMessage("");
        
        try {
            const response = await axios.post("/api/resendVerification", {email}, { withCredentials: true });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || "❌ Invalid verification code.");
        } finally {
            setResendLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-xl font-semibold mb-4">Verify Your Email</h1>
                <p className="text-gray-600 mb-4">A 6-digit verification code has been sent to <b>{email}</b>. Enter it below.</p>

                <input 
                    type="text" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    maxLength={6} 
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200" 
                    placeholder="Enter code"
                />
                
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {message && <p className="text-green-500 mt-2">{message}</p>}

                <button 
                    onClick={handleVerify} 
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify Code"}
                </button>

                <button
                    onClick={handleResend}
                    className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                    disabled={resendLoading}
                >
                    {resendLoading ? "Sending..." : "Resend Code"}
                </button>
            </div>
        </div>
    );
}
