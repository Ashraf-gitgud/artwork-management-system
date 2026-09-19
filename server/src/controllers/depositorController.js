import Depositor from "../models/Depositor.js";

export const getDepositors = async (req, res) => {
  try {
    const depositors = await Depositor.find().sort({ lastName: 1 });
    res.json(depositors);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch depositors",
    });
  }
};

export const getDepositorById = async (req, res) => {
  try {
    const depositor = await Depositor.findById(req.params.id);

    if (!depositor) {
      return res.status(404).json({
        message: "Depositor not found",
      });
    }

    res.json(depositor);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch depositor",
    });
  }
};

export const createDepositor = async (req, res) => {
  try {
    const depositor = await Depositor.create(req.body);
    res.status(201).json(depositor);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateDepositor = async (req, res) => {
  try {
    const depositor = await Depositor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!depositor) {
      return res.status(404).json({
        message: "Depositor not found",
      });
    }

    res.json(depositor);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
