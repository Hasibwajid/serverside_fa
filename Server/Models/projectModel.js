import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Add more project-related fields as needed
  
} ,{ timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
