import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Hold", "Deliver", "Cancel"],
      default: "Hold",
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'accepted','submitted','approved'],
      default: "sent"
    }
    ,
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date, // Adjust the type to Date for the due date
      required: true,
    },
    // Other properties as needed
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
