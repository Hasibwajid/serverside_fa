import express, { raw } from "express";
import { braintreeTokenController, makePaymentController, updateClientProfileController 
} from "../Controllers/clientController.js";
import { isClient, requireSignIn } from "../Middlewares/authMiddleware.js";
import {
  editProjectController,
  postProjectController,
} from "../Controllers/projectController.js";
import { deleteProjectController } from "../Controllers/projectController.js";
import { getPostedProjectController } from "../Controllers/projectController.js";
import {
  declineProposalController, getProjectProposalsController,
  getProposalDetailsController
} from "../Controllers/proposalController.js";
import {
  getFreelancerProfileController
} from "../Controllers/freelancerController.js";
import braintree from 'braintree';
import dotenv from 'dotenv'
import { getOffers } from "../Controllers/OffersController.js";
import { getSubmittedWorkByOfferIdController } from "../Controllers/SubmittedWorkController.js";


dotenv.config();
const router = express.Router();


router.get('/braintree/token' , braintreeTokenController)
router.post(
  '/makePayment/:proposalId',
  requireSignIn,
  isClient,
   makePaymentController);

// Client-specific routes
router.post("/createProject", requireSignIn, isClient, postProjectController);

router.put(
  "/updateProject/:projectId",
  requireSignIn,
  isClient,
  editProjectController
);

router.delete(
  "/deleteProject/:projectId",
  requireSignIn,
  isClient,
  deleteProjectController
);

router.get("/projects", requireSignIn, isClient, getPostedProjectController);

// set profile
router.put(
  "/setProfile/:clientId",
  requireSignIn,
  isClient,
  updateClientProfileController
);

// getfreelancerProfile
// Get profile 
router.get(
  "/getFreelancerProfile/:freelancerId",
  getFreelancerProfileController
);

// get proposals for specific projectposted
router.get(
  "/getProjectProposals/:projectId",
  requireSignIn,
  isClient,
  getProjectProposalsController
);

// get proposal detail when client clicks on a particular proposal in the list of received proposals
router.get(
  "/getProposalDetails/:proposalId",
  requireSignIn,
  isClient,
  getProposalDetailsController
);


// Decline a proposal for a specific project
router.put(
  "/declineProposal/:proposalId",
  requireSignIn,
  isClient,
  declineProposalController
);


router.get("/contracts",requireSignIn,isClient, getOffers)


router.get("/getSubmittedWork/:offerId", requireSignIn, isClient, getSubmittedWorkByOfferIdController);


export default router;
