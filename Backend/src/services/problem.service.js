import Problem from "../models/problem.model.js";

export const createProblem = async ({
  userId,
  title,
  description,
  category,
  tags = [],
  priority = "medium",
  status = "open",
}) => {
  // normalize tags
  const normalizedTags = [...new Set(
    tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)
  )];

  const problem = await Problem.create({
    userId,
    title: title.trim(),
    description: description.trim(),
    category,
    tags: normalizedTags,
    priority,
    status,
  });

  return problem;
};

export const getProblems = async (userId) => {
  const problems = await Problem.find({ userId }).sort({ createdAt: -1 });

  return {
    total: problems.length,
    problems,
  };
};