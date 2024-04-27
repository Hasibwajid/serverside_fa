import ClientProfile from "../Models/clientProfileModel.js";
import Proposal from "../Models/proposalModel.js";
import dotenv from 'dotenv'
import Offer from "../Models/OfferModel.js";
import { BraintreeGateway } from 'braintree';
import braintree from "braintree";

// SET CLIENT PROFILE
dotenv.config()
export const updateClientProfileController = async (req, res) => {
  try {
    const { company, companyWebsite, profilePhoto } = req.body;
    const { clientId } = req.params; // Assuming you have the logged-in user's ID

    // Find the client profile by user ID
    let clientProfile = await ClientProfile.findOne({ user: clientId });

    // If client profile doesn't exist, create a new one
    if (!clientProfile) {
      clientProfile = new ClientProfile({
        user: clientId,
        company,
        companyWebsite,
        profilePhoto,
      });
    } else {
      // Update client profile fields
      clientProfile.company = company;
      clientProfile.companyWebsite = companyWebsite;
      clientProfile.profilePhoto = profilePhoto;
    }

    // Save the updated client profile
    await clientProfile.save();

    res.status(200).send({
      success: true,
      message: "Client profile updated successfully",
      clientProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating client profile",
      error,
    });
  }
};

console.log('BRAINTREE_PUBLIC_KEY:', process.env.BRAINTREE_PUBLIC_KEY);
console.log('BRAINTREE_MERCHANT_ID:', process.env.BRAINTREE_MERCHANT_ID);
console.log('BRAINTREE_PRIVATE_KEY:', process.env.BRAINTREE_PRIVATE_KEY);

const gateway = new BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

console.log('Braintree Environment:', braintree.Environment.Sandbox)
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        console.error('Error generating client token:', err);
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).send(err);
  }

};

export const makePaymentController = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { nonce, dueDate, amount } = req.body;
    console.log('Nonce received: ', nonce)
    // Get proposal details and calculate amount
    const proposal_for = await getProposalDetailsFromDatabase(proposalId); // Implement this function
    const projectId = proposal_for.project;

    // Validate card details and funds
    // const isValidCardAndFunds = await validateCardAndFunds(nonce, amount);

    // if (!isValidCardAndFunds) {
    //   return res.status(400).json({ success: false, message: 'Invalid card details or insufficient funds' });
    // }

    // Create a transaction with Braintree
    gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true //Will REPLACE WITH HOLD IN ESCROW
      }
    }, async (err, result) => {
      if (result) {
        try {
          const offer = new Offer({
            proposal: proposalId,
            client: req.user._id,
            freelancer: proposal_for.freelancer,
            paymentStatus: 'Hold',
            dueDate: dueDate,
            project: projectId,
            amount: amount,
          });
          await offer.save();

          return res.json({ ok: true });
        } catch (error) {
          console.error('Error creating offer:', error);
          return res.status(500).json({ success: false, message: 'Error creating offer' });
        }
      }
      else {
        console.error('Error processing payment:', err);
        return res.status(500).send(err)
      }

    });
  } catch (error) {
    console.error('Error fetching proposal details:', error);
    res.status(500).json({ success: false, message: 'Error fetching proposal details' });
  }
};

const validateCardAndFunds = async (nonce, amount) => {
  try {
    const verificationResult = await gateway.paymentMethod.create({
      customerId: req.user._id, // Replace with actual customer ID
      paymentMethodNonce: nonce,
      options: {
        verifyCard: true,
      }
    });

    if (!verificationResult.success) {
      return false; // Card verification failed
    }

    // Step 2: Check if the card has sufficient funds
    const paymentMethodToken = verificationResult.paymentMethod.token;

    // Get the payment method details to retrieve the card type and last 4 digits
    const paymentMethod = await gateway.paymentMethod.find(paymentMethodToken);

    // Make a Braintree call to check if the card has sufficient funds
    // You might need to use the appropriate Braintree API call here
    const fundCheckResult = await performFundCheck(paymentMethod, amount);

    return fundCheckResult;
  } catch (error) {
    console.error('Error validating card and funds:', error);
    return false;
  }
};


const performFundCheck = async (paymentMethod, amount) => {
  try {
    // Implement logic to check if the card has sufficient funds
    // You might need to use the Braintree Transaction API to perform this check

    // Example: You can create a Braintree transaction with an amount of $0.01 to check funds
    const transactionResult = await gateway.transaction.sale({
      amount: '0.01',
      paymentMethodToken: paymentMethod.token,
      options: {
        submitForSettlement: false,
      }
    });

    if (transactionResult.success && transactionResult.transaction.status === 'authorized') {
      // Card has sufficient funds
      return true;
    } else {
      // Card does not have sufficient funds
      return false;
    }
  } catch (error) {
    console.error('Error performing fund check:', error);
    return false;
  }
};


const getProposalDetailsFromDatabase = async (proposalId) => {
  try {
    
    const proposal = await Proposal.findById(proposalId);
    return proposal;
  } catch (error) {
    throw new Error('Error fetching proposal details from the database');
  }
};
