require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const signupRoutes = require("./routes/signup");
const SigninRoutes = require("./routes/signin");
const getUserRoutes = require("./routes/getUser");
const favorite = require("./routes/favorite-trips");
const tripcreation = require("./leader_routes/tripcreation");
const signout = require("./routes/logout");
const adminUsers = require("./admin_routes/Allusers");
const support = require("./routes/support");
const verify = require("./middleware/verify");
const editTrip = require("./leader_routes/editTrip");
const onlyLeader = require("./routes/only-leader");
const cookieParser = require("cookie-parser");
const passUpdate = require("./middleware/updatePass");
const forgot = require("./routes/forgot");
const resendVerification = require("./routes/resendVerification");
const reset = require("./middleware/reset");
const leader_registration = require("./leader_routes/leaderRegistration");
const pendingLeaders = require("./admin_routes/promotion");
const interests = require("./user_routes/interests");
const Alltrips = require("./routes/getTrips");
const get_trip = require("./routes/get-trip");
const updateUserProfile = require("./routes/updateUserProfile");
const leaderTrips = require("./leader_routes/all_my_trips");
const generalProfile = require("./routes/GeneralProfile");
const bookTrip = require("./routes/book-trip");
const search_trip = require("./routes/search-trip");
const get_participants = require("./routes/get-participants");
const trip_approval = require("./admin_routes/approveTours");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests

app.use(cookieParser()); // Parse cookies
app.use(cors({
  origin: "https://coole-1.onrender.com",
  credentials: true,
}));
app.use("/api", resendVerification);
app.use("/api", signupRoutes);
app.use("/api", SigninRoutes);
app.use("/api", getUserRoutes);
app.use("/api", signout);
app.use("/api", tripcreation);
app.use("/api", verify);
app.use("/api", forgot);
app.use("/api", generalProfile);
app.use("/api", updateUserProfile);
app.use("/api", interests);
app.use("/api", adminUsers);
app.use("/api", search_trip);
app.use("/api", support);
app.use("/api", passUpdate);
app.use("/api", onlyLeader);
app.use("/api", pendingLeaders);
app.use("/api", leaderTrips);
app.set("trust proxy", 1);
app.use("/api", reset);
app.use("/api", leader_registration);
app.use("/api", trip_approval);
app.use("/api", Alltrips);
app.use("/api", favorite);
app.use("/api", get_trip);
app.use("/api", bookTrip);
app.use("/api", get_participants);
app.use("/api", editTrip);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);

// Construct the MongoDB URI
const uri = `mongodb+srv://cooletravelapp:${password}@cluster0.y5vja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("Koole Backend is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`❌ Port ${PORT} is already in use. Trying another port...`);
    app.listen(PORT + 1);
  }
});