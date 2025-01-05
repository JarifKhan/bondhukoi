import mongoose from "mongoose";

const ExamScheduleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    routine: [
        {
            date : {
                type: Date,
                required: true,
            },
            courseName: {
                type: String,
                required: true,
            },
        },
    ]
});

export default mongoose.models.ExamSchedule ||
    mongoose.model("ExamSchedule", ExamScheduleSchema);
