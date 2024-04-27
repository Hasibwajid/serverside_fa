// server/controllers/freelancerController.js

import FreelancerProfile from "../Models/freelancerProfileModel.js";
import multer from "multer"; // For handling file uploads


// Update the storage configuration to use memory storage for multer
const storage = multer.memoryStorage();

// Set up multer for handling file uploads
const upload = multer({ storage: storage });

export const updateFreelancerProfileController = async (req, res) => {
  try {
    const { skills, description, speciality, portfolio } = req.body;
    const { freelancerId } = req.params; // Assuming you have the logged-in user's ID

    // Get the file path of the uploaded profile photo (if any)
    const profilePhotoFilePath = req.file ? req.file.path : null;

    // Find the freelancer profile by user ID
    let freelancerProfile = await FreelancerProfile.findOne({
      user: freelancerId,
    });

    // If freelancer profile doesn't exist, create a new one
    if (!freelancerProfile) {
      freelancerProfile = new FreelancerProfile({
        user: freelancerId,
        skills,
        speciality,
        description,
        profilePhoto: profilePhotoFilePath, // Set the profile photo file path
        portfolio, // Set the portfolio directly as an array of objects
      });
    } else {
      
      // Update freelancer profile fields
      freelancerProfile.skills = skills;
      freelancerProfile.description = description;
      freelancerProfile.speciality = speciality;
      if (profilePhotoFilePath) {
        freelancerProfile.profilePhoto = profilePhotoFilePath; // Set the profile photo file path if provided
      }

      // Update portfolio items (if any)
      if (portfolio && Array.isArray(portfolio)) {
        freelancerProfile.portfolio = portfolio;
      }
    }

    // Save the updated freelancer profile
    await freelancerProfile.save();

    res.status(200).send({
      success: true,
      message: "Freelancer profile updated successfully",
      freelancerProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating freelancer profile",
      error,
    });
  }
};

// Backend Route: POST /api/v1/freelancer/setProfilePhoto/:freelancerId
export const setProfilePhotoController = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    // Find the freelancer profile by user ID
    let freelancerProfile = await FreelancerProfile.findOne({
      user: freelancerId,
    });

    if (!freelancerProfile) {
      return res.status(404).send({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    // Multer middleware to handle file upload (assuming you've set up multer properly)
    upload.single("profilePhoto")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);
        return res.status(500).send({
          success: false,
          message: "Error uploading profile photo",
          error: err,
        });
      } else if (err) {
        console.error("Unknown Error:", err);
        return res.status(500).send({
          success: false,
          message: "Unknown error occurred",
          error: err,
        });
      }

      // Get the file buffer of the uploaded profile photo (if any)
      const profilePhotoBuffer = req.file ? req.file.buffer : null;

      // If profilePhotoBuffer is available, convert it to base64
      if (profilePhotoBuffer) {
        const base64ProfilePhoto = profilePhotoBuffer.toString("base64");
        freelancerProfile.profilePhoto = base64ProfilePhoto;
      }

      // Save the updated freelancer profile
      await freelancerProfile.save();

      res.status(200).send({
        success: true,
        message: "Profile photo updated successfully",
        profilePhoto: profilePhotoBuffer ? profilePhotoBuffer.toString("base64") : null,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating profile photo",
      error,
    });
  }
};

// Get freelancer profile by user ID
export const getFreelancerProfileController = async (req, res) => {
  try {
    const freelancerId = req.user._id; // Assuming you have the freelancer's ID

    // Find the freelancer profile by user ID and populate the "user" field with selected fields including "description"
    const freelancerProfile = await FreelancerProfile.findOne({
      user: freelancerId,
    }).populate("user", "name email address city"); // Make sure "description" is included in the fields

    if (!freelancerProfile) {
      return res.status(404).send({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Freelancer profile retrieved successfully",
      freelancerProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error retrieving freelancer profile",
      error,
    });
  }
};


// Backend Route: POST /api/v1/freelancer/addPortfolio/:freelancerId
export const addPortfolioController = async (req, res) => {
  try {
    const { freelancerId } = req.params;
    const { title, description, files, projectURL } = req.body;

    // Find the freelancer profile by user ID
    let freelancerProfile = await FreelancerProfile.findOne({
      user: freelancerId,
    });

    if (!freelancerProfile) {
      return res.status(404).send({
        success: false,
        message: "Freelancer profile not found",
      });
    }

    // Add the new portfolio item to the portfolio array
    freelancerProfile.portfolio.push({
      title,
      description,
      files, // Array of files or image URLs
      projectURL,
    });

    // Save the updated freelancer profile
    await freelancerProfile.save();

    res.status(200).send({
      success: true,
      message: "Portfolio added successfully",
      freelancerProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error adding portfolio",
      error,
    });
  }
};



