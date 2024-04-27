import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
    required: true,
  },
  freelancerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FreelancerProfile", // Reference the FreelancerProfile model
    required: true,
  },
  bidAmount: {
    type: Number,
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["interviewing", "accepted", "pending", "declined"], // Add "rejected" status
    default: "pending",
  },
  timeEstimate: {
    type: Number,
    required: true,
  },
  attachment: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps: true});

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;
