// http://localhost:8080/api/v1/getProjectProposalsCount
import express, { raw } from "express";
import { getProjectProposalsCountController } from "../Controllers/generalController.js";


const router = express.Router();

router.get(
    "/getProjectProposalsCount/:projectId",
    getProjectProposalsCountController
  );


export default router;