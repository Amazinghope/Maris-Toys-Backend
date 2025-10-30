import Joi from "joi";
import mongoose from "mongoose";

export const validateMessage = (data) => {
  const schema = Joi.object({
    receiverId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      }, "ObjectId validation")
      .required()
      .messages({
        "any.invalid": "Invalid receiver ID format",
        "any.required": "Receiver ID is required",
      }),
    content: Joi.string()
      .trim()
      .min(1)
      .max(1000)
      .required()
      .messages({
        "string.empty": "Message content cannot be empty",
        "string.max": "Message content cannot exceed 1000 characters",
      }),
  });

  return schema.validate(data);
};
