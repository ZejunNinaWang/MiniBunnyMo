import express from 'express';
import { isAuth, isAdmin } from '../util';
import Order from '../models/orderModel';

const orderRoute = express.Router();


orderRoute.get("/", isAuth, async (req, res) => {
  const orders = await Order.find().populate('user'); //to have access to user info, not just an id
  res.send(orders);
});

orderRoute.get("/mine", isAuth, async (req, res) => {
  const orders = await Order.find({user: req.user._id});
  res.send(orders);
});

orderRoute.get("/:id", isAuth, async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id });
    if (order) {
      res.send(order);
    } else {
      res.status(404).send("Order Not Found.");
    }
});

orderRoute.delete("/:id", isAuth, isAdmin, async (req, res) => {
  console.log('in order delete');
  const order = await Order.findOne({ _id: req.params.id });
  if (order) {
    const deletedOrder = await order.remove();
    res.send(deletedOrder);
  } else {
    res.status(404).send("Order Not Found.")
  }
});

//Only signined users can access this api to create order
orderRoute.post("/", isAuth, async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: req.body.payment,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });
    const newOrderCreated = await newOrder.save();
    res.status(201).send({ message: "New Order Created", data: newOrderCreated });
  });

  export default orderRoute;