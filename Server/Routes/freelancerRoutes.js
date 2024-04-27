import express, { raw } from "express";
import { requireSignIn } from "../Middlewares/authMiddleware.js";
import { isFreelancer } from "../Middlewares/authMiddleware.js";
import { addPortfolioController, getFreelancerProfileController, setProfilePhotoController, updateFreelancerProfileController } from "../Controllers/freelancerController.js";
import { getAllProjectsController, getProjectByIdController } from "../Controllers/projectController.js";
import {
  checkProposalStatusController,
  createProposalController,
  deleteProposalController,
  getFreelancerProposalByJobController,
  getFreelancerProposalsController,
  getProposalDetailsController,
  updateProposalController,
} from "../Controllers/proposalController.js";
import {  acceptOfferController, getOffersByFId } from "../Controllers/OffersController.js";
import {submitWork,  getSubmittedWorkController, resendWorkController }from '../Controllers/SubmittedWorkController.js'
import { upload } from "../multerSetup.js"; // Provide the correct relative path
const router = express.Router();

router.put(
  "/setProfile/:freelancerId",
  requireSignIn,
  isFreelancer,
  updateFreelancerProfileController
);

// Get profile 
router.get(
  "/getFreelancerProfile",
  requireSignIn,
  isFreelancer,
  getFreelancerProfileController
);

router.put('/setProfilePhoto/:freelancerId',requireSignIn,isFreelancer, setProfilePhotoController)
// get all projects to show to a freelancer in jobs tab
router.get(
  "/getAllProjects",
  getAllProjectsController
);

// create proposal
router.post(
  "/createProposal/:projectId",
  requireSignIn,
  isFreelancer,
  createProposalController
);


router.post("/addPortfolio/:freelancerId",requireSignIn,isFreelancer, addPortfolioController);

// router.post('/updatePortfolio/:freelancerId',requireSignIn,isFreelancer, updatePortfolioController)

// see proposal sent
router.get(
  "/getProposals",
  requireSignIn,
  isFreelancer,
  getFreelancerProposalsController
);

router.get("/getProposalDetails/:proposalId", requireSignIn,getProposalDetailsController )

router.get("/getProjectById/:projectId", requireSignIn,isFreelancer,getProjectByIdController);


router.post(
  "/updateProposal/:proposalId",
  requireSignIn,
  isFreelancer,
  updateProposalController
);

router.delete(
  "/deleteProposal/:proposalId",
  requireSignIn,
  isFreelancer,
  deleteProposalController
);

router.get("/contracts",requireSignIn,isFreelancer, getOffersByFId)


router.put('/acceptOffer/:offerId',requireSignIn,isFreelancer,acceptOfferController)


router.get("/checkProposalStatus/:projectId", requireSignIn, isFreelancer, checkProposalStatusController);


router.get(
  "/getFreelancerProposalByJob/:projectId",
  requireSignIn,
  isFreelancer,
  getFreelancerProposalByJobController
);



router.post('/submitPayment/:offerId', requireSignIn, isFreelancer, upload.single("file"), submitWork);


router.get("/getSubmittedWork", requireSignIn, isFreelancer, getSubmittedWorkController)



router.put("/resendWork/:offerId", requireSignIn, isFreelancer, resendWorkController);

export default router;


