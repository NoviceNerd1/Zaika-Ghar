import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  getOrders,
  stripeWebhook,
} from "../controllers/order.controller.js";

const router = express.Router();

// Make sure this route is correct
router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);

router.route("/").get(isAuthenticated, getOrders);

router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebhook);

export default router;
