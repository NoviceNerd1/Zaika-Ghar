import express from "express";
import {
  createRestaurant,
  getRestaurant,
  getRestaurantOrder,
  getSingleRestaurant,
  searchRestaurant,
  updateOrderStatus,
  updateRestaurant,
  getAllRestaurants, // Add this import
} from "../controllers/restaurant.controller.js";
import upload from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// router
//   .route("/")
//   .post(isAuthenticated, upload.single("imageFile"), createRestaurant);
// router.route("/").get(isAuthenticated, getRestaurant);
// router
//   .route("/")
//   .put(isAuthenticated, upload.single("imageFile"), updateRestaurant);
// router.route("/order").get(isAuthenticated, getRestaurantOrder);
// router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
// router.route("/search/:searchText").get(isAuthenticated, searchRestaurant);
// router.route("/search/all").get(isAuthenticated, getAllRestaurants); // Add this route
// router.route("/:id").get(isAuthenticated, getSingleRestaurant);
// restaurant.routes.js - CORRECT ORDER:

// Specific routes FIRST
router.route("/search/all").get(getAllRestaurants);
// Parameterized routes SECOND
router.route("/search/:searchText").get(searchRestaurant);

// Other routes
router
  .route("/")
  .post(isAuthenticated, upload.single("imageFile"), createRestaurant)
  .get(isAuthenticated, getRestaurant)
  .put(isAuthenticated, upload.single("imageFile"), updateRestaurant);

router.route("/order").get(isAuthenticated, getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/:id").get(getSingleRestaurant);

export default router;
