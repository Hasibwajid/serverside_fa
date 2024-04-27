import User from "../Models/userModel.js";
import Proposal from "../Models/proposalModel.js";
import Project from "../Models/projectModel.js";
import FreelancerProfile from "../Models/freelancerProfileModel.js";

export const createProposalController = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { bidAmount, coverLetter, timeEstimate } = req.body;
    const freelancer = req.user._id; // Assuming you have the freelancer's ID in the request user object

    // Check if the project exists
    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
      return res.status(404).send({ error: "Project not found" });
    }

    // Find the freelancer's profile
    const freelancerProfile = await FreelancerProfile.findOne({
      user: freelancer,
    });

    // If the freelancer's profile doesn't exist, create a new one (optional)
    if (!freelancerProfile) {
      // You may create a new freelancer profile here or handle it as needed
      // Example:
      const newFreelancerProfile = await FreelancerProfile.create({
        user: freelancer,
        skills: ["default"], // Provide a default skill or an empty array
        description: "No description available", // Provide a default description
        portfolio: [], // Provide an empty array for the portfolio
        profilePhoto: "", // Provide an empty value for the profile photo
      });
        // Assign the new freelancerProfile to the freelancerProfile variable
      freelancerProfile = newFreelancerProfile;
    }

    // Create the proposal
    const newproposal = await Proposal.create({
      project: projectId,
      freelancer: freelancer,
      freelancerProfile: freelancerProfile._id,
      bidAmount: bidAmount,
      coverLetter: coverLetter,
      timeEstimate: timeEstimate,
    });

    res.status(201).send({
      success: true,
      message: "Proposal created successfully",
      proposal: newproposal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating proposal",
      error: error,
    });
  }
};

// Get all proposals for a specific project (client checks incoming proposals)
export const getProjectProposalsController = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Check if the project exists
    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
      return res.status(404).send({ error: "Project not found" });
    }

    // Find all proposals for the project
    const proposals = await Proposal.find({ project: projectId })
      .populate("freelancer", "name email city createdAt") // Populate the freelancer details
      .populate("freelancerProfile", "skills description portfolio profilePhoto") // Optionally populate the freelancer's profile details
      .select("-project"); // Exclude the project field from the response

    res.status(200).send({
      success: true,
      message: "Proposals retrieved successfully",
      proposals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in retrieving proposals",
      error,
    });
  }
};

// Get all proposals by a freelancer (freelancer view proposals sent by him)
export const getFreelancerProposalsController = async (req, res) => {
  try {
    const freelancerId = req.user._id; // Assuming you have the freelancer's ID in the request user object

    // Find all proposals by the freelancer
    const proposals = await Proposal.find({ freelancer: freelancerId })
      .populate("project", "title") // Populate the project details
      .populate("freelancerProfile", "skills description portfolio profilePhoto") // Optionally populate the freelancer's profile details
      .select("-freelancer"); // Exclude the freelancer field from the response

    res.status(200).send({
      success: true,
      message: "Proposals retrieved successfully",
      proposals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in retrieving proposals",
      error,
    });
  }
};
// Get accepted proposals for a freelancer
export const getAcceptedProposalsController = async (req, res) => {
  try {
    const freelancerId = req.user._id; // Assuming you have the freelancer's ID in the request user object

    // Find all accepted proposals by the freelancer
    const proposals = await Proposal.find({
      freelancer: freelancerId,
      status: "accepted",
    })
      .populate("project", "title") // Populate the project details
      .populate("freelancerProfile", "skills description portfolio profilePhoto") // Optionally populate the freelancer's profile details
      .select("-freelancer"); // Exclude the freelancer field from the response

    res.status(200).send({
      success: true,
      message: "Accepted proposals retrieved successfully",
      proposals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in retrieving accepted proposals",
      error,
    });
  }
};



// Update a proposal
export const updateProposalController = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { bidAmount, coverLetter } = req.body;

    // Find the proposal by ID
    let proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).send({
        success: false,
        message: "Proposal not found",
      });
    }

    // Update bidAmount and coverLetter fields
    proposal.bidAmount = bidAmount;
    proposal.coverLetter = coverLetter;

    // Save the updated proposal
    await proposal.save();

    res.status(200).send({
      success: true,
      message: "Proposal updated successfully",
      proposal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating proposal",
      error,
    });
  }
};

// Get details of a specific proposal
export const getProposalDetailsController = async (req, res) => {
  try {
    const proposalId = req.params.proposalId;

    // Find the proposal by ID and populate the relevant fields
    const proposal = await Proposal.findById(proposalId)
      .populate({
        path: "freelancer",
        select: "name city createdAt", // Select the desired fields from the freelancer model
      })
      .populate({
        path: "freelancerProfile",
        select: "profilePhoto speciality skills description portfolio", // Select the desired fields from the freelancerProfile model
      })
      .populate("project", "title description");

    if (!proposal) {
      return res.status(404).send({ error: "Proposal not found" });
    }

    res.status(200).send({
      success: true,
      message: "Proposal details retrieved successfully",
      proposal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in retrieving proposal details",
      error,
    });
  }
};



// Delete a proposal
export const deleteProposalController = async (req, res) => {
  try {
    const proposalId = req.params.proposalId;

    // Check if the proposal exists
    const existingProposal = await Proposal.findById(proposalId);
    if (!existingProposal) {
      return res.status(404).send({ error: "Proposal not found" });
    }

    // Delete the proposal
    await Proposal.findByIdAndDelete(proposalId);

    // Remove the proposal from the project's list of proposals
    await Project.updateOne(
      { _id: existingProposal.project },
      { $pull: { proposals: proposalId } }
    );

    res.status(200).json({ success: true, message: "Proposal deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in deleting proposal", error });
  }
};


export const declineProposalController = async (req, res) => {
  try {
    const { proposalId } = req.params;

    // Find the proposal by ID
    const existingProposal = await Proposal.findById(proposalId);
    if (!existingProposal) {
      return res.status(404).send({ error: "Proposal not found" });
    }

    // Set the proposal status to "rejected"
    existingProposal.status = "declined";
    await existingProposal.save();

    res.status(200).json({ success: true, message: "Proposal declined successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in declining proposal", error });
  }
};



export const checkProposalStatusController = async (req, res) => {
  try {
    const { projectId } = req.params;
    const freelancerId = req.user._id; // Assuming you have access to the authenticated user's ID

    // Check if the freelancer has sent a proposal for the specified project
    const proposal = await Proposal.findOne({
      freelancer: freelancerId,
      project: projectId,
    });

    if (proposal) {
      // Freelancer has sent a proposal
      return res.status(200).json({ hasSentProposal: true });
    } else {
      // Freelancer has not sent a proposal
      return res.status(200).json({ hasSentProposal: false });
    }
  } catch (error) {
    console.error("Error checking proposal status:", error);
    return res.status(500).json({ error: "An error occurred while checking proposal status" });
  }
};



export const getFreelancerProposalByJobController = async (req, res) => {
  try {
  
    const freelancerId = req.user._id; // Assuming you can access the freelancer's ID from req.user
    const { projectId } = req.params;
  
    // Fetch the proposal based on freelancerId and jobId
    const proposal = await Proposal.findOne({
      freelancer: freelancerId,
      project: projectId,
    });
    console.log('freelancer', freelancerId)
    console.log('jobId', projectId)
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json({ proposal });
  } catch (error) {
    console.error("Error fetching freelancer's proposal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
