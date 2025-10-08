import Joi from "joi";

export const orderValidationSchema = Joi.object({
  items: Joi.array().items(Joi.object({
        productId: Joi.string().required().messages({
          "string.empty": "Product ID is required",
        }),
        qty: Joi.number().integer().min(1).default(1).messages({
          "number.base": "Quantity must be a number",
          "number.min": "Quantity cannot be less than 1",
        }),
      })
    ).min(1).required().messages({
      "array.base": "Items must be an array",
      "array.min": "At least one item is required",
    }),

  shippingAddress: Joi.object({
    fullName: Joi.string().required().messages({
      "string.empty": "Full name is required",
    }),
    address: Joi.string().required().messages({
      "string.empty": "Address is required",
    }),
    city: Joi.string().required().messages({
      "string.empty": "City is required",
    }),
    postalCode: Joi.string().required().messages({
      "string.empty": "Postal code is required",
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required",
    }),
  }).required(),

  paymentMethod: Joi.string()
    .valid("Paystack", "Cash on Delivery", "Stripe", "Flutterwave")
    .required()
    .messages({
      "string.empty": "Payment method is required",
      "any.only": "Invalid payment method",
    }),
});
