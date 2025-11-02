import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await axios.post(`/api/update-password`, {
                token,
                newPassword
            });

            setMessage("✅ رمز عبور با موفقیت تغییر یافت!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError("❌ عملیات ناموفق بود، مجددا تلاش کنید.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-6">
            <h1 className="text-2xl font-bold mb-4">بازنشانی رمز عبور</h1>
            <form onSubmit={handleReset} className="w-full max-w-md bg-white p-6 rounded-3xl shadow-lg">
                <input
                    type="password"
                    className="w-full p-3 border rounded-3xl mb-4"
                    placeholder="رمز عبور جدید"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {message && <p className="text-green-500 mb-2">{message}</p>}
                <button type="submit" disabled={loading} className="w-full text-white py-3 rounded-3xl bg-green-500">
                    {loading ? "در حال تغییر..." : "ذخیره رمز عبور"}
                </button>
            </form>
        </div>
    );
}
