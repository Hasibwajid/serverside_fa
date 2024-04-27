import mongoose from "mongoose";

const submittedWorkSchema = new mongoose.Schema(
  {
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    attachedFile: {
      type: String, // You can store the file path or URL here
    },
    // Other properties as needed
  },
  { timestamps: true }
);

const SubmittedWork = mongoose.model("SubmittedWork", submittedWorkSchema);

export default SubmittedWork;
