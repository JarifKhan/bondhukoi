// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  username: { type: String, required: true },
  photo: { type: String,required: true },
  firstname: { type: String },
  lastname: {type: String }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
