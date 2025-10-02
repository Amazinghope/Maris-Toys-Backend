import httpStatus from 'http-status'
import Order from '../../models/order.js'
import Product from '../../models/product.js'

/**
 * Create order
 * POST /api/orders
 * body: { items: [{ productId, qty }], shippingAddress: {...}, paymentMethod }
 */


// const  createOrder = async (req, res, next ) =>{
//     try {
//         const  {items, shippingAddress, paymentMethod } = req.body;
//         if(!items || !Array.isArray(items) || items.length === 0){
//             return res.status(httpStatus.NOT_FOUND).json({
//                 message: 'No items found!'
//             })

//         const orderItems = await Promise.all(
//             items.map(async (itm) => {
//                 const id = itm.productId || itm._id
//                 const qty = Number(itm.qty || 1)
//                 const prod = await Product.findById(id)
//                 if(!prod) throw new Error(`Product ${id} not found`)
//                 return {
//                 product: prod._id,
//                 name: prod.name,
//                 price: prod.price,
//                 qty,
//                 image: prod.image
//             }
//             })
//         )
//         const totalPrice = orderItems.reduce()
//         }
//     } catch (error) {
        
//     }
// }


export const createOrder = async (req, res, next) => {
  try {
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

/**
 * Get order by id
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name price image");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};
