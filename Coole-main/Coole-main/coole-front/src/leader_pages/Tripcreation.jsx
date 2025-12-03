import { useState, useEffect } from "react";
import { UploadCloud, MapPin, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import arrowR from "../assets/Icons/arrowR.svg";
import arrowL from "../assets/Icons/arrowL.svg";
import upload from "../assets/Icons/upload.svg";
import picPlaceHolder from "../assets/Icons/picPlaceHolder.svg";
import picUpload from "../assets/Icons/picUpload.svg";
import plus from "../assets/Icons/plus.svg";
import calendarO from "../assets/Icons/calendarO.svg"
import tick from "../assets/Icons/tick.svg"
import beach from "../assets/Icons/beach.svg"
import city from "../assets/Icons/city.svg"
import desert from "../assets/Icons/desert.svg"
import camping from "../assets/Icons/camping.svg"
import jungle from "../assets/Icons/jungle.svg"
import mountains from "../assets/Icons/mountains.svg"
import offroad from "../assets/Icons/offroad.svg"
import stars from "../assets/Icons/stars.svg"
import rafting from "../assets/Icons/rafting.svg"
import squares from "../assets/Icons/squares.svg"


export default function TripCreation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const customLucideIcon = new L.DivIcon({
    html: `<div style="width: 30px; height: 40px; display: flex; align-items: center; justify-content: center;">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"/>
               <circle cx="12" cy="10" r="3"/>
             </svg>
           </div>`,
    className: "", // Keep class empty for proper rendering
    iconSize: [30, 40],
    iconAnchor: [15, 40], // Adjust to position correctly
  });
  
  const addNewStep = () => {
    setTripData((prev) => ({
      ...prev,
      steps: [...prev.steps, { title: "", description: "", date:null, image: null }],
    }));
  };
  
  useEffect(() => {
    if (tripData.steps.length === 0) addNewStep();
  }, []);
  
  const handleStepChange = (index, field, value) => {
    setTripData((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index][field] = value;
      return { ...prev, steps: updatedSteps };
    });
  };
  
  const handleStepImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setTripData((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index].image = file;
      return { ...prev, steps: updatedSteps };
    });
  };
  
  const validateTrip = () => {
    if (!tripData.program_name || !tripData.destination_city || !tripData.description) {
      alert("❌ لطفاً اطلاعات برنامه را کامل کنید.");
      return false;
    }
    if (!tripData.schedule.start_date || !tripData.schedule.end_date) {
      alert("❌ لطفاً تاریخ شروع و پایان را مشخص کنید.");
      return false;
    }
    return true;
  };
  
  
  const removeStep = (index) => {
    setTripData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };
  
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setTripData((prev) => ({
          ...prev,
          schedule: {
            ...prev.schedule,
            location: {
              ...prev.schedule.location,
              coordinates: [lat, lng],
            },
          },
        }));
      },
    });
  
    return tripData.schedule.location.coordinates.length ? (
      <Marker position={tripData.schedule.location.coordinates} icon={customLucideIcon} />
    ) : null;
  }
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/getUser`,  {
          withCredentials: true,
        });
        if (response.data.role === "Leader" && !response.data.leaderDetails?.isApproved) {
          navigate("/leader-registration"); // Redirect if leader is unverified
        } else if (response.data.role !== "Leader") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate]);

  const [tripData, setTripData] = useState({
    program_name: "",
    destination_city: "",
    program_type: "Public",
    description: "",
    images: [],
    steps: [],
    schedule: {
      start_date: "",
      end_date: "",
      start_time: "",
      return_time: "",
      location: {
        address: "",
        coordinates: [],
      },
    },
    activities: [],
    max_participants: 1,
    services: {
      transportation: "",
      insurance: "",
      meals: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
      },
    },
    cost_per_person: 0,
    age_range: {
      min: 0,
      max: 0,
    },
    facilities: [],
  });

  // Handle file upload
  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([...files, ...uploadedFiles]);
  
    setTripData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedFiles], // Store files
    }));
  };
  

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (category, key, value) => {
    setTripData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!validateTrip()) return; // Validate before submission
    try {
      const formData = new FormData();

// ✅ Append main trip images
tripData.images.forEach((file) => formData.append("images", file));

// ✅ Append step images with unique keys
tripData.steps.forEach((step) => {
  formData.append("stepsImages", step.image || new Blob([])); // use empty Blob if no image
});



// ✅ Serialize step data **excluding images**
const stepsWithoutImages = tripData.steps.map(({ image, date, ...rest }) => ({
  ...rest,
  date: date?.toString() || "", // Convert to JS Date if available
  image: undefined, // Exclude image from serialization
}));
formData.append("stepsData", JSON.stringify(stepsWithoutImages)); // Steps metadata

// ✅ Serialize trip data **excluding images**
formData.append(
  "tripData",
  JSON.stringify({
    ...tripData,
    schedule: {
      ...tripData.schedule,
      start_date: tripData.schedule.start_date?.toString() || "",
      end_date: tripData.schedule.end_date?.toString() || "",
    },
    images: undefined,
    steps: undefined,
  })
);

    const response = await axios.post(`/api/trips`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
        });
    if (response.status === 201) {
      alert("✅ برنامه با موفقیت ایجاد شد!");
      navigate("/dashboard");
    }
    } catch (error) {
      console.error("Error saving trip:", error);
      alert(error.response?.data?.message || "❌ خطا در ایجاد برنامه");
    }
  };
  
  
  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      {/* White Content Area */}
      <div className="flex-1 overflow-y-auto bg-white rounded-t-3xl px-6 pt-4 pb-32">
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <button
            onClick={() => {
              if (step === 0) {
                navigate("/dashboard");
              } else {
                setStep(step - 1);
              }
            }}
            className="bg-gray-100 p-2 rounded-xl shadow-sm"
            aria-label="بازگشت"
          >
            <img src={arrowR} alt="back" className="w-6 h-6" />
          </button>

          {/* Title */}
          <h2 className="text-xl font-semibold text-black text-center flex-1 text-center">
            ایجاد برنامه جدید
          </h2>

          {/* Empty placeholder for spacing symmetry */}
          <div className="w-10" />
        </div>

        {step < 7 && (
          <>
            <div className="flex justify-between gap-1 flex-row-reverse my-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                    index === 6 - step ? "bg-orange-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="text-right text-gray-500 font-medium mb-4">
              <span className="font-bold text-gray-700">مرحله {step + 1}</span> از 7
            </div>
          </>
        )}

        {/* Step 1: Upload Images */}
        {step === 0 && (
    <div className="bg-white rounded-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 text-right">تصاویر برنامه</h3>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center w-full my-6">
          <div className="relative w-[96px] h-[96px] rounded-full bg-[#F3F4F6] flex items-center justify-center">
            <div className="w-[78px] h-[78px] rounded-full bg-[#E5E7EB] flex items-center justify-center">
              <div className="w-[60px] h-[60px] rounded-full bg-[#D1D5DB] flex items-center justify-center">
                <img src={upload} alt="upload" className="w-[27px] h-[23px]" />
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-700 text-center mt-2">
          تصاویر و ویدیوهای برنامه را انتخاب و آپلود کنید
        </p>
        <p className="text-sm text-gray-400">حداکثر حجم برای هر فایل ۱ مگابایت</p>

        <input type="file" multiple id="fileUpload" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          onClick={() => document.getElementById("fileUpload").click()}
          className="bg-black text-white rounded-3xl px-5 py-2 mt-4"
        >
          انتخاب فایل‌ ها
        </button>
      </div>

      {/* Uploaded Files List */}
      <div className="mt-4 space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
            <div className="flex items-center gap-3">
              <img src={URL.createObjectURL(file)} alt="uploaded" className="w-12 h-12 rounded-md object-cover" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} کیلوبایت</p>
              </div>
            </div>
            <button onClick={() => setFiles(files.filter((_, i) => i !== index))} className="text-red-500">
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

        {/* Step 2: Program Details */}
      {/* Step 2: Program Details */}
  {step === 1 && (
    <div className="bg-white rounded-lg">
      <h3 className="text-lg text-black font-semibold mb-4">توضیحات برنامه</h3>

      <div className="space-y-4">
        {/* Program Name */}
        <div>
          <label className="text-gray-700 text-sm">اسم برنامه :</label>
          <input
            name="program_name"
            placeholder=""
            className="w-full p-3 text-black border-none bg-gray-100 rounded-3xl focus:outline-none"
            onChange={handleChange}
            value={tripData.program_name}
          />
        </div>

        {/* Destination City */}
        <div>
          <label className="text-gray-700 text-sm">شهر مقصد :</label>
          <input
            name="destination_city"
            placeholder=""
            className="w-full p-3 text-black border-none bg-gray-100 rounded-3xl focus:outline-none"
            onChange={handleChange}
            value={tripData.destination_city}
          />
        </div>

        {/* Program Type */}
        <div>
          <label className="text-gray-700 text-sm">نوع برنامه :</label>
          <div className="bg-gray-100 p-1 rounded-3xl flex justify-between mt-2">
            <button
              type="button"
              className={`w-1/2 py-2 rounded-3xl ${
                tripData.program_type === "Private"
                  ? "text-gray-500"
                  : "bg-black text-white"
              }`}
              onClick={() => setTripData({ ...tripData, program_type: "Public" })}
            >
              برنامه عمومی
            </button>
            <button
              type="button"
              className={`w-1/2 py-2 rounded-3xl ${
                tripData.program_type === "Private"
                  ? "bg-black text-white"
                  : "text-gray-500"
              }`}
              onClick={() => setTripData({ ...tripData, program_type: "Private" })}
            >
              برنامه خصوصی
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-gray-700 text-sm">متن توضیحات برنامه :</label>
          <textarea
            name="description"
            placeholder=""
            className="w-full p-3 text-black border-none bg-gray-100 rounded-lg focus:outline-none h-28 resize-none"
            onChange={handleChange}
            value={tripData.description}
          />
        </div>
      </div>
    </div>
  )}

  {step === 2 && (
    <div className="bg-white rounded-lg h-[750px] overflow-y-auto">
      <h3 className="text-lg text-black font-semibold mb-4">مراحل سفر</h3>

      <div className="space-y-6">
        {tripData.steps.map((stepItem, index) => (
          <div key={index} className="border-b pb-4">
            {/* Step Number with Indicator */}
            <div className="flex items-center gap-2 justify-start mb-2">
              <div className="w-4 h-4 rounded-full bg-[#308C55] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white"></div>
              </div>
              <p className="text-gray-700 font-medium">مرحله {index + 1}</p>
            </div>

            {/* Image Selection */}
            <div className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {stepItem.image ? (
                    <img
                    src={URL.createObjectURL(stepItem.image)}
                    alt="step preview"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <img
                    src={picPlaceHolder}
                    alt="placeholder"
                    className="w-8 h-8 opacity-60"
                  />
                )}
                </div>
              <div className="flex flex-col items-start gap-1">
                <button
                  type="button"
                  onClick={() => document.getElementById(`stepImage-${index}`).click()}
                  className="flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded-3xl"
                >
                  <span className="text-sm">انتخاب تصویر</span>
                  <img src={picUpload} alt="upload icon" className="w-4 h-4" />
                </button>

                {/* Limit Note Below Button */}
                <p className="text-gray-500 text-xs mt-1 pr-1">حداکثر حجم برای هر فایل ۱ مگابایت</p>
              </div>
              <input
                type="file"
                id={`stepImage-${index}`}
                className="hidden"
                onChange={(e) => handleStepImageChange(index, e)}
              />
            </div>

            {/* Step Title Input */}
            <div className="p-4">
              <label className="text-gray-700 text-sm">متن مرحله :</label>
              <input
                name="title"
                className="w-full p-3 text-black border-none bg-gray-100 rounded-3xl focus:outline-none mt-1"
                value={stepItem.title}
                onChange={(e) => handleStepChange(index, "title", e.target.value)}
              />
            </div>

            {/* Step Description */}
            <div className="p-4">
              <label className="text-gray-700 text-sm">توضیحات مرحله :</label>
              <textarea
                name="description"
                className="w-full p-3 border-none text-black bg-gray-100 rounded-3xl focus:outline-none h-24 mt-1"
                value={stepItem.description}
                onChange={(e) => handleStepChange(index, "description", e.target.value)}
              />
            </div>

            {/* Date and Time Selection */}
            <div className="p-4">
              <label className="text-gray-700 text-sm">تاریخ و زمان :</label>
              <div className="flex justify-center w-full mt-2">
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={stepItem.date || "1403/08/26"}
                  onChange={(date) => handleStepChange(index, "date", date)}
                  format="YYYY/MM/DD"
                  calendarPosition="bottom-center"
                  render={(value, openCalendar) => {
                    const [year, month, day] = value?.toString().split("/") ?? ["----", "--", "--"];
                    return (
                      <div
                        onClick={openCalendar}
                        className="bg-[#F3F4F6] rounded-full flex items-center justify-center px-6 py-2 cursor-pointer w-full max-w-md text-sm font-medium text-gray-700"
                      >
                        <span className="px-1">{day}</span>
                        <span className="px-1">/</span>
                        <span className="px-1">{month}</span>
                        <span className="px-1">/</span>
                        <span className="px-1">{year}</span>
                      </div>
                    );
                  }}
                />
              </div>
            </div>

            {/* Delete Step Button (only if more than 1 step exists) */}
            {tripData.steps.length > 1 && (
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="text-red-500 font-medium"
                  onClick={() => removeStep(index)}
                >
                  حذف مرحله
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add More Steps Button */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="h-px bg-gray-300 flex-1 max-w-[120px]" />
        
        <button
          type="button"
          onClick={addNewStep}
          className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center"
        >
          <img src={plus} alt="Add Step" className="w-5 h-5" />
        </button>

        <div className="h-px bg-gray-300 flex-1 max-w-[120px]" />
      </div>
    </div>
  )}


  {step === 3 && (
    <div className="bg-white rounded-lg">
      <h3 className="text-lg font-bold text-black mb-4">اطلاعات زمان و مکان</h3>

      {/* Start & End Date Selection */}
      <div className="space-y-4">
        <label className="text-gray-700 text-sm">تاریخ شروع و پایان</label>
        <div className="space-y-2">
          <div className="relative bg-gray-100 p-3 rounded-full flex items-center justify-between">
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={tripData.schedule.start_date || "1403/08/26"}
              onChange={(date) => handleNestedChange("schedule", "start_date", date)}
              format="YYYY/MM/DD"
              calendarPosition="bottom-center"
              render={(value, openCalendar) => {
                const [year, month, day] = value?.toString().split("/") ?? ["----", "--", "--"];
                return (
                  <div
                    onClick={openCalendar}
                    className="w-full flex items-center justify-between cursor-pointer"
                  > 
                    <img src={calendarO} alt="calendar" className="w-5 h-5" />
                    {/* Right side: calendar icon + date */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-black font-medium">
                        <span>{day}</span>
                        <span>/</span>
                        <span>{month}</span>
                        <span>/</span>
                        <span>{year}</span>
                      </div>
                      <span className="text-gray-500 text-sm whitespace-nowrap">تاریخ شروع</span>
                    </div>
                  </div>
                );
              }}
            />
          </div>
          <div className="relative bg-gray-100 p-3 rounded-lg flex items-center justify-between">
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={tripData.schedule.end_date}
              onChange={(date) => handleNestedChange("schedule", "end_date", date)}
              dateFormat="yyyy/MM/dd"
              className="bg-transparent focus:outline-none w-full"
            />
            <img src={calendarO} alt="calendar" className="w-5 h-5 absolute right-3" />
          </div>
        </div>
      </div>

      {/* Departure & Return Time */}
      <div className="flex justify-between mt-2 gap-2">
        {/* Start Time */}
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">ساعت رفت</label>
          <input
            type="text"
            placeholder="مثلاً: 14:30"
            value={tripData.schedule.start_time}
            onChange={(e) => handleNestedChange("schedule", "start_time", e.target.value)}
            className="bg-gray-100 w-[162px] h-[44px] rounded-3xl text-right text-black focus:outline-none p-4"
          />
        </div>

        {/* Return Time */}
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">ساعت برگشت</label>
          <input
            type="text"
            placeholder="مثلاً: 20:15"
            value={tripData.schedule.return_time}
            onChange={(e) => handleNestedChange("schedule", "return_time", e.target.value)}
            className="bg-gray-100 w-[162px] h-[44px] rounded-3xl text-right text-black focus:outline-none p-4"
          />
        </div>
      </div>

      {/* Location Selection */}
      <div className="mt-4">
        <label className="text-gray-700 text-sm mb-1 block">لوکیشن محل مورد نظر</label>
        <input
          name="location_text"
          placeholder="آدرس متنی"
          className="w-full p-3 text-black border-none bg-gray-100 rounded-3xl focus:outline-none"
          value={tripData.schedule.location.address}
          onChange={(e) =>
            setTripData((prev) => ({
              ...prev,
              schedule: {
                ...prev.schedule,
                location: {
                  ...prev.schedule.location,
                  address: e.target.value,
                },
              },
            }))
          }
        />
      </div>

      {/* Interactive Map for Location Selection */}
      <div className="mt-4 w-full h-60">
        <MapContainer center={[35.6892, 51.3890]} zoom={13} className="h-full w-full rounded-lg">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <LocationMarker />
        </MapContainer>
      </div>

      </div>
  )}

  {step === 4 && (
    <div className="bg-white rounded-lg space-y-6">
      <h3 className="text-xl font-bold text-black">انتخاب تفریحات و نفرات</h3>

      {/* Activities Selection */}
      <div className="flex flex-wrap gap-3">
        {[
          { name: "کمپینگ", icon: "🏕️", color: "bg-gray-700", activeColor: "bg-yellow-700 text-white" },
          { name: "جنگل", icon: "🌳", color: "bg-gray-700", activeColor: "bg-green-500 text-white" },
          { name: "ساحل", icon: "🏖️", color: "bg-gray-700", activeColor: "bg-yellow-700 text-white" },
          { name: "آفرود", icon: "🏎️", color: "bg-gray-700", activeColor: "bg-red-500 text-white" },
          { name: "رفتینگ", icon: "🌊", color: "bg-gray-700", activeColor: "bg-blue-800 text-white" },
          { name: "نجومی", icon: "✨", color: "bg-gray-700", activeColor: "bg-yellow-500 text-white" },
          { name: "کویرگردی", icon: "🌵", color: "bg-gray-700", activeColor: "bg-orange-600 text-white" },
          { name: "داخل شهر", icon: "🏙️", color: "bg-gray-700", activeColor: "bg-blue-600 text-white" },
          { name: "کوه نوردی", icon: "⛰️", color: "bg-gray-700", activeColor: "bg-green-700 text-white" },
        ].map((activity) => {
          const isSelected = tripData.activities.includes(activity.name);
          return (
            <button
              key={activity.name}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isSelected ? activity.activeColor : activity.color
              }`}
              onClick={() => {
                setTripData((prev) => ({
                  ...prev,
                  activities: isSelected
                    ? prev.activities.filter((a) => a !== activity.name)
                    : [...prev.activities, activity.name],
                }));
              }}
            >
              {activity.icon} {activity.name}
            </button>
          );
        })}
      </div>

      {/* Participant Count Selection */}
      <div>
        <p className="text-gray-700 mb-2">تعداد نفرات</p>
        <input
          type="number"
          className="w-full p-3 border-none bg-gray-100 rounded-3xl text-right text-gray-700 pr-4"
          value={tripData.max_participants || ""}
          onChange={(e) => {
            const value = e.target.value;
            setTripData((prev) => ({
              ...prev,
              max_participants: value === "" ? "" : Math.max(1, Number(value)), // Prevent negative numbers
            }));
          }}
        />
        <div className="flex justify-right gap-3 mt-3">
          {[10, 25, 50].map((num) => (
            <button
              key={num}
              className={`px-3 py-1 rounded-3xl ${
                tripData.max_participants == num ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() =>
                setTripData((prev) => ({
                  ...prev,
                  max_participants: num,
                }))
              }
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  )}
        {/* Step 6: Services & Costs */}
        {step === 5 && (
    <div className="bg-white rounded-lg space-y-6">
      <h3 className="text-xl text-black font-bold">جزئیات خدمات</h3>

      {/* Transportation Selection */}
      <div>
        <p className="text-gray-700 mb-2">نوع وسیله نقلیه</p>
        <div className="flex gap-2">
          {["سواری", "اتوبوس", "ون"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-3xl ${
                tripData.services.transportation === type
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setTripData((prev) => ({
                ...prev,
                services: { ...prev.services, transportation: type },
              }))}
            >
              {type}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="w-full p-3 border-none bg-gray-100 rounded-3xl mt-2"
          placeholder="اتوبوس وی آی پی"
          value={tripData.services.vehicleType || ""}
          onChange={(e) =>
            setTripData((prev) => ({
              ...prev,
              services: { ...prev.services, vehicleType: e.target.value },
            }))
          }
        />
        {/* Cost Per Person */}
        {/* <div>
          <p className="text-gray-700 mb-2">قیمت هر نفر (تومان)</p>
          <input
            type="number"
            className="w-full p-3 border-none bg-gray-100 rounded-3xl text-gray-700"
            value={tripData.cost_per_person || ""}
            onChange={(e) =>
              setTripData((prev) => ({
                ...prev,
                cost_per_person: Number(e.target.value),
              }))
            }
            placeholder="مثلاً: 250000"
          />
        </div> */}

      </div>

      {/* Meal Selection */}
      {/* <div>
        <p className="text-gray-700 mb-2">وعده های غذایی:</p>
        <div className="flex justify-between">
          {["breakfast", "lunch", "dinner"].map((mealKey) => (
            <div key={mealKey} className="text-center">
              <p className="text-gray-600 mb-1">{mealKey === "breakfast" ? "صبحانه" : mealKey === "lunch" ? "ناهار" : "شام"}</p>
              <select
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700"
                value={tripData.services.meals[mealKey]}
                onChange={(e) =>
                  handleNestedChange("services", "meals", {
                    ...tripData.services.meals,
                    [mealKey]: Number(e.target.value),
                  })
                }
              >
                {[0, 1, 2, 3].map((num) => (
                  <option key={num} value={num}>
                    {num} وعده
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div> */}
      
      {/* Meal Selection */}
      <div className="w-full max-w-md mt-6">
        <label className="text-gray-700 font-medium mb-2 block">وعده‌های غذایی</label>
        <div className="flex gap-3 justify-center">
          {/* Breakfast */}
          <div className="flex flex-col items-right gap-1">
            <p className="text-sm text-gray-600 px-2 font-medium">صبحانه</p>
            <div className="px-5 py-2 bg-gray-100 rounded-3xl text-gray-700">
              <input
                type="text"
                value={tripData.services.meals.breakfast || ""}
                onChange={(e) =>
                  handleNestedChange("services", "meals", {
                    ...tripData.services.meals,
                    breakfast: e.target.value,
                  })
                }
                className="bg-transparent text-right w-10 outline-none"
              />
              <span className="text-xs text-gray-500 pr-1">وعده</span>
            </div>
          </div>

          {/* Lunch */}
          <div className="flex flex-col items-right gap-1">
            <p className="text-sm text-gray-600 px-2 font-medium">ناهار</p>
            <div className="px-5 py-2 bg-gray-100 rounded-3xl text-gray-700">
              <input
                type="text"
                value={tripData.services.meals.lunch || ""}
                onChange={(e) =>
                  handleNestedChange("services", "meals", {
                    ...tripData.services.meals,
                    lunch: e.target.value,
                  })
                }
                className="bg-transparent text-right w-10 outline-none"
              />
              <span className="text-xs text-gray-500 pr-1">وعده</span>
            </div>
          </div>

          {/* Dinner */}
          <div className="flex flex-col items-right gap-1">
            <p className="text-sm text-gray-600 px-2 font-medium">شام</p>
            <div className="px-5 py-2 bg-gray-100 rounded-3xl text-gray-700">
              <input
                type="text"
                value={tripData.services.meals.dinner || ""}
                onChange={(e) =>
                  handleNestedChange("services", "meals", {
                    ...tripData.services.meals,
                    dinner: e.target.value,
                  })
                }
                className="bg-transparent text-right w-10 outline-none"
              />
              <span className="text-xs text-gray-500 pr-1">وعده</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Services Toggle */}
      {/* <div className="flex items-center justify-between">
        <p className="text-gray-700">خدمات درمانی</p>
        <input
          type="checkbox"
          className="toggle-checkbox"
          checked={tripData.services.medicalService || false}
          onChange={() =>
            setTripData((prev) => ({
              ...prev,
              services: { ...prev.services, medicalService: !prev.services.medicalService },
            }))
          }
        />
      </div> */}
      
      {/* Medical Services Toggle */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-gray-700">خدمات درمانی</p>
        <button
          type="button"
          onClick={() =>
            setTripData((prev) => ({
              ...prev,
              services: {
                ...prev.services,
                medicalService: !prev.services.medicalService,
              },
            }))
          }
          className={`w-14 h-8 flex items-center rounded-full px-1 transition-colors duration-300 ${
            tripData.services.medicalService ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              tripData.services.medicalService ? "translate-x-0" : "translate-x-6"
            }`}
          />
        </button>
      </div>

      {/* Insurance Selection */}
      <div>
        <p className="text-gray-700 mb-2">نوع بیمه:</p>
        <select
          className="w-full p-3 bg-gray-100 rounded-3xl text-gray-700"
          value={tripData.services.insurance}
          onChange={(e) =>
            setTripData((prev) => ({
              ...prev,
              services: { ...prev.services, insurance: e.target.value },
            }))
          }
        >
          <option value="">انتخاب بیمه</option>
          <option value="بیمه سلامت سفر">بیمه سلامت سفر</option>
          <option value="بیمه مسافرتی">بیمه مسافرتی</option>
        </select>
      </div>
    </div>
        )}

      {step === 6 && (
        <div className="bg-white rounded-lg space-y-6">
          <h3 className="text-xl font-bold text-black">توضیحات تکمیلی</h3>

          {/* Cost per Person */}
          <div>
            <p className="text-gray-700 mb-2 text-lg font-bold">هزینه برنامه برای هر نفر</p>
            <div className="flex items-center justify-between bg-gray-100 rounded-full px-4 py-3">
              
              <input
                type="text"
                value={tripData.cost_per_person || ""}
                onChange={(e) =>
                  setTripData((prev) => ({
                    ...prev,
                    cost_per_person: e.target.value,
                  }))
                }
                className="bg-transparent text-black text-right flex-1 mr-2 outline-none"
              />
              <span className="text-sm text-gray-400">تومان</span>
            </div>
          </div>

          {/* Age Range */}
          <div>
            <p className="text-gray-700 mb-2 text-lg font-bold">رنج سنی</p>
            <div className="flex justify-between gap-3">
              {/* Max Age */}
              <div className="flex flex-col items-right w-1/2">
                <label className="text-xs text-gray-400 mb-1 px-2">تا (سال)</label>
                <input
                  type="text"
                  value={tripData.age_range.max || ""}
                  onChange={(e) =>
                    setTripData((prev) => ({
                      ...prev,
                      age_range: {
                        ...prev.age_range,
                        max: e.target.value,
                      },
                    }))
                  }
                  className="bg-gray-100 text-black text-center rounded-full py-2 w-full outline-none"
                />
              </div>

              {/* Min Age */}
              <div className="flex flex-col items-right w-1/2">
                <label className="text-xs text-gray-400 mb-1 px-2">از (سال)</label>
                <input
                  type="text"
                  value={tripData.age_range.min || ""}
                  onChange={(e) =>
                    setTripData((prev) => ({
                      ...prev,
                      age_range: {
                        ...prev.age_range,
                        min: e.target.value,
                      },
                    }))
                  }
                  className="bg-gray-100 text-black text-center rounded-full py-2 w-full outline-none"
                />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <p className="text-gray-700 mb-2 text-lg font-bold">امکانات برنامه :</p>
            <textarea
              value={tripData.facilitiesText || ""}
              onChange={(e) =>
                setTripData((prev) => ({
                  ...prev,
                  facilitiesText: e.target.value,
                }))
              }
              className="w-full bg-gray-100 text-black p-4 rounded-2xl resize-none h-36 outline-none"
              placeholder=""
            />
          </div>
        </div>
      )}

        {/* Step 8: Final Confirmation */}
        {step === 7 && (
          <div className="flex flex-col items-center gap-4 mt-20">
            <div className="flex items-center justify-center w-full my-6">
              <div className="relative w-[118px] h-[118px] rounded-full bg-[#D9E9DF] flex items-center justify-center">
                <div className="w-[100px] h-[100px] rounded-full bg-[#76B297] flex items-center justify-center">
                  <div className="w-[82px] h-[82px] rounded-full bg-[#308C55] flex items-center justify-center">
                    <img src={tick} alt="tick" className="w-[27px] h-[23px]" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-center text-lg font-bold">برنامه شما با موفقیت ایجاد شد </p>
            <p className="text-gray-500 text-center text-sm mt-2">
            برنامه شما پس از بررسی توسط تیم پشتیبانی بزودی در فهرست برنامه ها قرار میگیرد 
            </p>
          </div>
        )}
        </div>
      {/* Navigation Buttons */}
      <div className="mt-2 bg-white px-6 pb-1 pt-1">
        {step < 8 && (
          <div className="fixed bottom-8 left-4 right-4 z-50">
            <button
              onClick={() => setStep(step + 1)}
              className="bg-[#F36235] text-white w-full h-12 rounded-full px-4 text-base font-bold flex items-center justify-between shadow-md"
            >
              <span className="flex-1 text-center">
                {step === 6
                  ? "ایجاد برنامه"
                  : step === 7
                  ? "ارسال اطلاعات"
                  : "مرحله بعدی"}
              </span>
              {step < 7 && (
                <img src={arrowL} alt="next" className="w-5 h-5 ml-2" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
