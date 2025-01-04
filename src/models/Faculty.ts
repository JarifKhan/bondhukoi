import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  office: { type: String, required: false },
  researchInterests: [{ type: String }],
  category: { type: String, required: true },
});

export default mongoose.models.Faculty || mongoose.model("Faculty", FacultySchema);
