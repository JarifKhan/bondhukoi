import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	routine: [
		{
			day: {
				type: String,
				enum: [
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
					"Sunday",
				],
				required: true,
			},
			startTime: {
				type: String,
				required: true,
			},
			endTime: {
				type: String,
				required: true,
			},
		},
	],
	public: {
		type: Boolean,
		default: true,
	},
});

export default mongoose.models.Schedule ||
	mongoose.model("Schedule", ScheduleSchema);
