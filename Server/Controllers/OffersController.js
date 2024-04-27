import Offer from "../Models/OfferModel.js";


// Controller to get contracts for the "Offers" tab
export const getOffers = async (req, res) => {
  try {
    const client = req.user._id; // Assuming you have the user ID in req.user._id
    const offers = await Offer.find({ client })
      .populate('project', 'title description')
      .populate('freelancer', 'name')
      .exec();

    res.status(200).json({ offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const getOffersByFId = async (req, res) => {
    try {
       const freelancerId =  req.user._id; // Assuming you have the user ID in req.user._id
      const offers = await Offer.find({ freelancer: freelancerId })
        .populate('project', 'title description')
        .populate('freelancer', 'name')
        .exec();
  
      res.status(200).json({ offers });
    } catch (error) {
      console.error('Error fetching offers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const acceptOfferController = async (req, res) => {
    try {
      const offerId = req.params.offerId;
      const updatedOffer = await Offer.findByIdAndUpdate(
        offerId,
        { status: 'accepted' },
        { new: true } // Return the updated offer
      );
      res.json(updatedOffer);
    } catch (error) {
      console.error('Error accepting offer:', error);
      res.status(500).json({ message: 'Error accepting offer' });
    }
  }
