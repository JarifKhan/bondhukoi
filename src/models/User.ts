// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	clerkId: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true },
	firstname: { type: String },
	lastname: { type: String },
	photo: { type: String, required: false },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
