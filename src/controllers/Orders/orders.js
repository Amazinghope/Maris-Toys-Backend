import httpStatus from 'http-status'
import Order from '../../models/order.js'
import Product from '../../models/product.js'
import { orderValidationSchema } from '../../validators/orderValidator.js';

// export const createOrder = async (req, res, next) => {
//   try {
//     const {error} = orderValidationSchema.validate(req.body, {abortEarly: false})
//     if(error){
//       return res.status(httpStatus.BAD_REQUEST).json({
//         message: 'Order failed',
//         details: error.details
//       })
//     }
//     const { items, shippingAddress, paymentMethod } = req.body;

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(httpStatus.BAD_REQUEST).json({ message: "No items in order" });
//     }

//     // Resolve products and snapshot their price/name
//     const orderItems = await Promise.all(
//       items.map(async (itm) => {
//         const id = itm.productId || itm._id;
//         const qty = Number(itm.qty || 1);
//         const prod = await Product.findById(id);
//         if (!prod) throw new Error(`Product ${id} not found`);
//         return {
//           product: prod._id,
//           name: prod.name,
//           price: prod.price,
//           qty,
//           image: prod.image,
//         };
//       })
//     );

//     const totalPrice = orderItems.reduce((total, item) => total + item.price * item.qty, 0);

//     const order = await Order.create({
//       items: orderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//     });

//     // res.status(httpStatus.OK).json({ id: order._id, order });
//     res.status(httpStatus.CREATED).json(order);

//   } catch (err) {
//     next(err);
//   }
// };


// export const getOrderById = async (req, res, next) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("items.product", "name price image");
//     if (!order) return res.status(httpStatus.NOT_FOUND).json({ message: "Order not found" });
//     res.json(order);
//   } catch (err) {
//     next(err);
//   }
// };

export const createOrder = async (req, res, next) => {
  try {
    const { error } = orderValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Order validation failed",
        details: error.details,
      });
    }

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "No items in order" });
    }

    // 🔹 Fetch product snapshots
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

    // 🔹 Create order
    const order = await Order.create({
      userId: req.user?._id , // safe even if not authenticated
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    console.log("✅ Created order ID:", order._id);

    res.status(httpStatus.CREATED).json(order);
  } catch (err) {
    console.error("❌ Order creation failed:", err.message);
    next(err);
  }
};
// export const getOrderById = async (req, res, next) => {
//   try {
//     console.log("Fetching order with ID:", req.params.id);
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       console.log("Order not found for ID:", req.params.id);
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.json(order);
//   } catch (err) {
//     console.error("Error in getOrderById:", err.message);
//     next(err);
//   }
// };
export const getOrderById = async (req, res, next) => {
  try {
    console.log("Fetching order with ID:", req.params.id);

    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")           // optional, if you need user info
      .populate("items.product", "name price image"); // <-- THIS populates product details

    if (!order) {
      console.log("Order not found for ID:", req.params.id);
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error in getOrderById:", err.message);
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
