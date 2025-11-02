import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function LeaderEditTrip() {
    const { id: tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [newImages, setNewImages] = useState([]); // Store new images before saving
    const [deletedImages, setDeletedImages] = useState([]); // Store images marked for deletion
    const navigate = useNavigate();

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

    async function handleSave() {
        setSaving(true);
        try {
            const formData = new FormData();
    
            // ✅ Attach JSON trip data (excluding images)
            formData.append("tripData", JSON.stringify(trip));
    
            // ✅ Attach new images
            newImages.forEach((file) => formData.append("images", file));
    
            // ✅ Attach deleted images list
            formData.append("deletedImages", JSON.stringify(deletedImages));
    
            const response = await axios.put(
                `/api/edit-trip/${tripId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
            );
    
            setTrip(response.data.trip); // Update state
            setNewImages([]); // Reset
            setDeletedImages([]); // Reset
            alert("✅ تغییرات با موفقیت ذخیره شد!");
        } catch (err) {
            alert("❌ خطا در ذخیره تغییرات");
        } finally {
            setSaving(false);
        }
    }
    
    function handleAddImage(event) {
        const file = event.target.files[0];
        if (!file) return;
        setNewImages([...newImages, file]); // Store locally until saved
    }

    function handleDeleteImage(image) {
        setDeletedImages([...deletedImages, image]); // Mark for deletion
        setTrip({ ...trip, images: trip.images.filter((img) => img !== image) });
    }

    if (loading) return <div className="text-center mt-10 text-black">در حال بارگذاری...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* ✅ Header Image */}
            <div className="relative w-full h-[40vh] sm:h-[50vh] flex-shrink-0">
                <img
                    src={trip?.images?.[0] || "/placeholder.jpg"}
                    alt={trip?.program_name || "No Name"}
                    className="w-full h-full object-cover rounded-b-3xl"
                />
                {/* 🔙 Back Button */}
                <button className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-md" onClick={() => window.history.back()}>
                    ⬅
                </button>
            </div>

            {/* ✅ Editable Form */}
            <div className="flex-1 overflow-y-auto px-6 pb-20 max-w-lg mx-auto w-full">
                {/* ✅ Trip Name */}
                <div className="mt-4">
                    <label className="text-black font-medium">نام سفر:</label>
                    <input
                        type="text"
                        value={trip.program_name}
                        onChange={(e) => setTrip({ ...trip, program_name: e.target.value })}
                        className="w-full p-2 border rounded-md text-black"
                    />
                </div>

                {/* ✅ Description */}
                <div className="mt-4">
                    <label className="text-black font-medium">توضیحات:</label>
                    <textarea
                        value={trip.description}
                        onChange={(e) => setTrip({ ...trip, description: e.target.value })}
                        className="w-full p-2 border rounded-md text-black"
                        rows="3"
                    />
                </div>

                {/* ✅ Images Section */}
                <h2 className="text-lg font-bold text-black mt-6">📸 تصاویر سفر</h2>
                <div className="flex flex-wrap gap-3 mt-3">
                    {trip.images?.map((img, index) => (
                        <div key={index} className="relative w-24 h-24">
                            <img src={img} alt="trip" className="w-full h-full rounded-lg object-cover shadow-md" />
                            <button
                                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                                onClick={() => handleDeleteImage(img)}
                            >
                                ✖
                            </button>
                        </div>
                    ))}
                </div>

                {/* ✅ New Images (Pending Upload) */}
                {newImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                        {newImages.map((file, index) => (
                            <div key={index} className="relative w-24 h-24">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="new"
                                    className="w-full h-full rounded-lg object-cover shadow-md opacity-70"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* ✅ Add New Image */}
                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddImage}
                        className="flex-1 p-2 border rounded-md text-black"
                    />
                    {newImages.length > 0 && <span className="text-gray-500">تصاویر جدید آماده ذخیره!</span>}
                </div>

                {/* ✅ Cost Per Person */}
                <div className="w-full max-w-lg mx-auto bg-white p-4 border-t shadow-lg flex justify-between items-center mt-6">
                    <label className="text-black font-medium">هزینه هر نفر:</label>
                    <input
                        type="number"
                        value={trip.cost_per_person}
                        onChange={(e) => setTrip({ ...trip, cost_per_person: e.target.value })}
                        className="p-2 border rounded-md w-24 text-black"
                    />
                </div>

                {/* ✅ Save Changes Button */}
                <button
                    className="bg-green-600 text-white p-3 rounded-full shadow-lg"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "⏳ در حال ذخیره..." : "💾 ذخیره تغییرات"}
                </button>
            </div>
        </div>
    );
}
