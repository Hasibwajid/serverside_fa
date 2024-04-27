import Project from "../Models/projectModel.js";
import Proposal from "../Models/proposalModel.js";


// Get the count of proposals for a specific project
export const getProjectProposalsCountController = async (req, res) => {
    try {
      const projectId = req.params.projectId;
  
      // Check if the project exists
      const existingProject = await Project.findById(projectId);
      if (!existingProject) {
        return res.status(404).send({ error: "Project not found" });
      }
  
      // Find the count of proposals for the project
      const proposalsCount = await Proposal.countDocuments({ project: projectId });
  
      res.status(200).send({
        success: true,
        message: "Proposals count retrieved successfully",
        count: proposalsCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in retrieving proposals count",
        error,
      });
    }
  };