import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: String,
  },
  companyWebsite: {
    type: String,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  // Other client-specific fields
});

const ClientProfile = mongoose.model("ClientProfile", clientProfileSchema);

export default ClientProfile;
