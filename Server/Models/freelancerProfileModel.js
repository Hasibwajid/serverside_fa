import mongoose from "mongoose";

// Define a separate schema for portfolio items
const portfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  projectURL:{
    type:String
  },
  tags:{
    type:[String]
  }
  // You can add more fields as needed for the portfolio items
});

const freelancerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  speciality: {
    type: String,
   
  },
  skills: {
    type: [String],
  },
  description: {
    type: String,
  },
  portfolio: {
    type: [portfolioItemSchema], // Use the portfolioItemSchema as a subdocument
    default: [],
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  // Other freelancer-specific fields
});

const FreelancerProfile = mongoose.model(
  "FreelancerProfile",
  freelancerProfileSchema
);

export default FreelancerProfile;
