import asyncHandler from "../utils/asyncHandler.js";
import * as problemService from "../services/problem.service.js";

export const createProblemController = asyncHandler(async (req, res) => {
  const createdProblem = await problemService.createProblem({
    userId: req.user._id,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    message: "Problem created successfully",
    data: createdProblem,
  });
});

export const getProblemsController = asyncHandler(async (req, res) => {
  const result = await problemService.getProblems(req.user._id);

  res.status(200).json({
    success: true,
    message: "Problems fetched successfully",
    data: result,
  });
});