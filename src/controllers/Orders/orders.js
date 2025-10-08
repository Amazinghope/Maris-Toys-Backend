import httpStatus from 'http-status'
import Order from '../../models/order.js'
import Product from '../../models/product.js'
import { orderValidationSchema } from '../../validators/orderValidator.js';

export const createOrder = async (req, res, next) => {
  try {
    const {error} = orderValidationSchema.validate(req.body, {abortEarly: false})
    if(error){
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Order failed',
        details: error.details
      })
    }
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "No items in order" });
    }

    // Resolve products and snapshot their price/name
    const orderItems = await Promise.all(
      items.map(async (itm) => {
        const id = itm.productId || itm._id;
        const qty = Number(itm.qty || 1);
        const prod = await Product.findById(id);
        if (!prod) throw new Error(`Product ${id} not found`);
        return {
          product: prod._id,
          name: prod.name,
          price: prod.price,
          qty,
          image: prod.image,
        };
      })
    );

    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.qty, 0);

    const order = await Order.create({
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    res.status(httpStatus.OK).json({ id: order._id, order });
  } catch (err) {
    next(err);
  }
};


export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name price image");
    if (!order) return res.status(httpStatus.NOT_FOUND).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(httpStatus.OK).json(orders);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(httpStatus.OK).json(orders);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
       message: error.message });
  }
};
