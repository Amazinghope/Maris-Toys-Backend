import httpStatus from 'http-status'
import Order from '../../models/order.js'
import Product from '../../models/product.js'
import User from '../../models/user.js'
import SibApiV3Sdk from 'sib-api-v3-sdk'
import { orderValidationSchema } from '../../validators/orderValidator.js';


export const createOrder = async (req, res, next) => {
  console.log("🟢 Received order payload:", JSON.stringify(req.body, null, 2));
  console.log("👤 Authenticated user:", req.user); // Add this
  // console.log("🧩 Items being sent:", items);



  try {
    const { error } = orderValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      console.log("❌ Joi Validation Error:", error.details);
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Order validation failed",
        details: error.details,
      });
    }

    const { items, shippingAddress, paymentMethod } = req.body;
 console.log("🧩 Items being sent:", items);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "No items in order" });
    }

    // 🔹 Fetch product snapshots
    const orderItems = await Promise.all(
      items.map(async (itm) => {
        const id = itm.product;
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
      deliveryStatus: "Pending",
    });

    console.log("✅ Created order ID:", order._id);
     // --- Send email to user ---
    if (req.user?.email) {
      const client = SibApiV3Sdk.ApiClient.instance;
      client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;
      const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

      await tranEmailApi.sendTransacEmail({
        // sender: { email: "noreply@edutoy.com", name: "EduToy Store" },
        sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Maris Educreative Toy Store" },
        to: [{ email: req.user.email, name: req.user.name }],
        subject: `Order Confirmation - #${order._id}`,
        htmlContent: `
          <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto; padding:10px;">
            <h2>Thank you for your order!</h2>
            <p>Hi ${req.user.name || "Customer"},</p>
            <p>Your order with ID <b>${order._id}</b> has been received.</p>
            <h3>Order Summary:</h3>
            <ul>
              ${order.items
                .map(
                  (item) =>
                    `<li>${item.name} - Qty: ${item.qty} - ₦${item.price}</li>`
                )
                .join("")}
            </ul>
            <p><b>Total:</b> ₦${order.totalPrice}</p>
            <p>We will notify you when the order is shipped.</p>
          </div>
        `,
      });
    }

    
    
try {
  // 1️⃣ Fetch all admins
  const admins = await User.find({ role: "admin" });
  console.log("Admins found:", admins);

  if (!admins.length) {
    console.log("❌ No admins found in the database. Make sure you have at least one admin.");
    return;
  }

  // 2️⃣ Map to Brevo email format
  const adminEmails = admins.map(a => ({ email: a.email, name: a.name }));
  console.log("Admin emails:", adminEmails);

  // 3️⃣ Initialize Brevo client
  const client = SibApiV3Sdk.ApiClient.instance;
  client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

  if (!process.env.BREVO_API_KEY) {
    console.log("❌ BREVO_API_KEY is missing in your environment variables!");
    return;
  }

  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  // 4️⃣ Send email
  const sendResponse = await tranEmailApi.sendTransacEmail({
    // sender: { email: "noreply@edutoy.com", name: "EduToy Store" },
    sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Maris Educreative Toy Store" },

    to: adminEmails,
    subject: `New Order Placed - #${order._id}`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto; padding:10px;">
        <h2>New Order Received</h2>
        <p>Order ID: <b>${order._id}</b></p>
        <p>User: <b>${req.user?.name || "Guest"}</b> - ${req.user?.email || "N/A"}</p>
        <h3>Order Details:</h3>
        <ul>
          ${order.items.map(item => `<li>${item.name} - Qty: ${item.qty} - ₦${item.price}</li>`).join("")}
        </ul>
        <p><b>Total:</b> ₦${order.totalPrice}</p>
        <p>Delivery Status: ${order.deliveryStatus}</p>
      </div>
    `,
  });

  console.log("✅ Email sent successfully:", sendResponse);
} catch (error) {
  console.error("❌ Error sending admin email:", error.response?.body || error);
}



    res.status(httpStatus.CREATED).json(order);
  } catch (err) {
    console.error("❌ Order creation failed:", err.message);
    next(err);
  }
};

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
    const orders = await Order.find({ userId: req.user.id }).populate("items.product", "name price image") // optional: populate product info
      .sort({ createdAt: -1 });
;
    // res.status(httpStatus.OK).json(orders);
    res.status(httpStatus.OK).json({ orders });

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      message: error.message });
  }
};

// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });
//     // res.status(httpStatus.OK).json(orders);
//     res.status(httpStatus.OK).json({ orders });

//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//        message: error.message });
//   }
// };
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("🔥 Error in getAllOrders:", error);
    res.status(500).json({ message: error.message });
  }
};

// export const updateDeliveryStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     order.deliveryStatus = status;
//     await order.save();

//     // Optional: notify user
//     if (order.userId) {
//       const client = SibApiV3Sdk.ApiClient.instance;
//       const apiKey = client.authentications["api-key"];
//       apiKey.apiKey = process.env.BREVO_API_KEY;
//       const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

//       await tranEmailApi.sendTransacEmail({
//         // sender: { email: "noreply@edutoy.com", name: "EduToy Store" },
//         sender: { email: process.env.BREVO_SENDER_EMAIL, name: "Maris Educreative Toy Store" },
//         to: [{ email: order.userId.email }],
//         subject: `Your Order #${order._id} Status Updated`,
//         htmlContent: `<p>Hi ${order.userId.name || "Customer"}, your order status is now <b>${status}</b>.</p>`
//       });
//     }

//     res.json({ success: true, message: "Delivery status updated", order });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Populate user details
    const order = await Order.findById(req.params.id).populate("userId", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Update delivery status
    order.deliveryStatus = status;
    await order.save();

    // ✅ Notify user by email
    if (order.userId?.email) {
      const client = SibApiV3Sdk.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.BREVO_API_KEY;

      const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

      await tranEmailApi.sendTransacEmail({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: "Maris Educreative Toy Store",
        },
        to: [{ email: order.userId.email }],
        subject: `Your Order #${order._id} Status Updated`,
        htmlContent: `
          <p>Hi ${order.userId.name || "Customer"},</p>
          <p>Your order status has been updated to <b>${status}</b>.</p>
          <p>Thank you for shopping with us! 🎉</p>
        `,
      });
    }
    if (!order.userId?.email) {
  console.warn(`⚠️ Order ${order._id} has no email — skipping email notification.`);
  return res.json({ success: true, message: "Delivery status updated (no email)", order });
}


    res.json({
      success: true,
      message: "Delivery status updated successfully",
      order,
    });
  } catch (err) {
    console.error("🔥 Error updating order status:", err);
    res.status(500).json({ message: "Server error" });
  }
};
