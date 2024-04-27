import Offer from "../Models/OfferModel.js";
import SubmittedWork from '../Models/SubmittedWorkModel.js'
import multer from "multer";
import path from "path";

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// In your controller
export const submitWork = async (req, res) => {
  const { message } = req.body;
  const { offerId } = req.params;

  try {
    // Find the offer in the database
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    console.log('req.file', req.file); // Check if req.file is defined

    // Create a new submitted work entry
    const submittedWork = new SubmittedWork({
      offer: offerId,
      freelancer: req.user._id,
      project: offer.project,
      description: message,
      attachedFile: req.file.filename, // Save the filename in the database
    });

    // Save the submitted work
    await submittedWork.save();
    offer.status = "submitted";
    await offer.save();
    res.status(201).json({ message: "Work submitted successfully" });
  } catch (error) {
    console.error('Error submitting work:', error);
    res.status(500).json({ error: 'An error occurred while submitting work' });
  }
};

export const getSubmittedWorkController = async (req, res) => {
  try {
    console.log('dfsdfsdkfsdk')
    const freelancerId = req.user._id; // Assuming you have the authenticated user's ID available
    const submittedWork = await getSubmittedWorkByFreelancerId(freelancerId); // You need to implement this function
    res.status(200).json({ submittedWork });
  } catch (error) {
    console.error("Error fetching submitted work:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};


export const getSubmittedWorkByFreelancerId = async (freelancerId) => {
  try {
    const submittedWork = await SubmittedWork.find({ freelancer: freelancerId })
      .populate('offer')
      .populate('project')
      .exec();

    return submittedWork;
  } catch (error) {
    console.error('Error fetching submitted work:', error);
    throw error;
  }
};



export const resendWorkController = async (req, res) => {
  try {
    const offerId = req.params.offerId;
    const { message, file } = req.body;

    // Update the existing submitted work record
    const updatedSubmittedWork = await SubmittedWork.findOneAndUpdate(
      { offer: offerId },
      { message: message, file: file },
      { new: true } // Return the updated record
    );

    if (!updatedSubmittedWork) {
      return res.status(404).json({ message: "Submitted work not found" });
    }

    res.status(200).json({ message: "Work resent successfully", submittedWork: updatedSubmittedWork });
  } catch (error) {
    console.error("Error resending work:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const getSubmittedWorkByOfferIdController = async (req, res) => {
  const { offerId } = req.params;

  try {
    const submittedWork = await getSubmittedWorkByOfferId(offerId);
    res.status(200).json({ submittedWork });
  } catch (error) {
    console.error("Error fetching submitted work:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getSubmittedWorkByOfferId = async (offerId) => {
  try {
    const submittedWork = await SubmittedWork.find({ offer: offerId })
      .populate("offer")
      .populate("project")
      .populate('freelancer')
      .exec();
    return submittedWork;
  } catch (error) {
    throw error;
  }
};