import Buyer from "../models/Buyer.js";

export const getBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.find().sort({ lastName: 1 });
    res.json(buyers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buyers" });
  }
};

export const getBuyerById = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    res.json(buyer);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buyer" });
  }
};

export const createBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body);
    res.status(201).json(buyer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    res.json(buyer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
