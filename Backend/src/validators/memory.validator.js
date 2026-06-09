import Joi from 'joi';

export const captureSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
  category: Joi.string().valid('coding', 'deen', 'admin', 'life').optional(),
  type: Joi.string().valid('decision', 'preference', 'learning', 'goal', 'fact').optional(),
});

export const updateMemorySchema = Joi.object({
  content: Joi.string().max(500).optional(),
  category: Joi.string().valid('coding', 'deen', 'admin', 'life').optional(),
  type: Joi.string().valid('decision', 'preference', 'learning', 'goal', 'fact').optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const deleteMemorySchema = Joi.object({
  confirm: Joi.boolean().valid(true).required(),
});
