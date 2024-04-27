import projectModel from "../Models/projectModel.js";
import ClientProfile from "../Models/clientProfileModel.js";

export const postProjectController = async (req, res) => {
  try {
    const { client, title, tags, budget, description } = req.body;

    // Validations
    if (!client) {
      return res.status(400).send({ error: "client id required" });
    }
    if (!title) {
      return res.status(400).send({ error: "tile is required" });
    }
    if (!tags) {
      return res.status(400).send({ error: "tags are required" });
    }
    if (!budget) {
      return res.status(400).send({ error: "budget is required" });
    }
    if (!description) {
      return res.status(400).send({ error: "description is required" });
    }

    //   create new project

    const project = await new projectModel({
      client,
      title,
      tags,
      budget,
      description,
    }).save();

    res.status(201).send({
      success: true,
      message: "Project posted successfully",
      project,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in project posting",
      error,
    });
  }
};

export const editProjectController = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { title, tags, budget, description } = req.body;

    // Validations
    if (!projectId) {
      return res.status(400).send({ error: "Project ID is required" });
    }
    if (!title) {
      return res.status(400).send({ error: "Title is required" });
    }
    if (!tags) {
      return res.status(400).send({ error: "Tags are required" });
    }
    if (!budget) {
      return res.status(400).send({ error: "Budget is required" });
    }
    if (!description) {
      return res.status(400).send({ error: "Description is required" });
    }

    // Find the project by ID
    const project = await projectModel.findById(projectId);

    if (!project) {
      return res.status(404).send({ error: "Project not found" });
    }

    // Update project data
    project.title = title;
    project.tags = tags;
    project.budget = budget;
    project.description = description;

    // Save the updated project
    await project.save();

    res.status(200).send({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in updating project",
      error: err,
    });
  }
};

export const deleteProjectController = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Check if the project exists
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Delete the project
    await projectModel.findByIdAndDelete(projectId);

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error in deleting project", error });
  }
};

export const getPostedProjectController = async (req, res) => {
  try {
    const clientId = req.user._id;
    const projects = await projectModel.find({ client: clientId });

    if (projects.length === 0) {
      return res.status(404).send({
        success: true,
        message: "No projects found for the client",
        projects: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in retrieving projects",
      error,
    });
  }
};

// get ALL PROJECTS

export const getAllProjectsController = async (req, res) => {
  try {
    const projects = await projectModel.find();

    if (projects.length === 0) {
      return res.status(404).send({
        success: true,
        message: "No projects found",
        projects: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in retrieving projects",
      error,
    });
  }
};

// for project detail page 
export const getProjectByIdController = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Find the project by ID
    const project = await projectModel.findById(projectId)
    .populate();

    if (!project) {
      return res.status(404).send({ error: "Project not found" });
    }

    res.status(200).send({
      success: true,
      message: "Project retrieved successfully",
      project,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in retrieving project",
      error: err,
    });
  }
};
