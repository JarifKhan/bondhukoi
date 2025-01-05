import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	friend: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	status: {
		type: String,
		enum: ["pending", "accepted", "rejected"],
		default: "pending",
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.models.Friend || mongoose.model("Friend", FriendSchema);
