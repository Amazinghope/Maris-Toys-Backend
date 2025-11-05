import Joi from "joi";

export const orderValidationSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required().messages({
          "string.empty": "Product ID is required",
        }),
        name: Joi.string().required().messages({
          "string.empty": "Product name is required",
        }),
        price: Joi.number().required().messages({
          "number.base": "Price must be a number",
        }),
        qty: Joi.number()
          .integer()
          .min(1)
          .default(1)
          .messages({
            "number.base": "Quantity must be a number",
            "number.min": "Quantity cannot be less than 1",
          }),
        image: Joi.string().allow("").optional(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Items must be an array",
      "array.min": "At least one item is required",
    }),

  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    postalCode: Joi.string()
      .pattern(/^\d+$/)
      .required()
      .messages({
        "string.pattern.base": "Postal code must contain only digits.",
      }),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^\d+$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must contain only digits.",
      }),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
  }).required(),

  paymentMethod: Joi.string()
    .valid("Bank Transfer")
    .required()
    .messages({
      "string.empty": "Payment method is required",
      "any.only": "Only 'Bank Transfer' is accepted at the moment",
    }),

  totalPrice: Joi.number().required().messages({
    "number.base": "Total price must be a number",
  }),
  vat: Joi.number().required().messages({
    "number.base": "Vat price must be a number",
  }),

  grandTotal: Joi.number().required().messages({
    "number.base": "Total price must be a number",
  }),
  shippingFee: Joi.number().required().messages({
    "number.base": "Total price must be a number",
  }),
});


