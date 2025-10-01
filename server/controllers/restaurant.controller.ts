import type { Request, Response } from "express";
import {
  Restaurant,
  type IRestaurantDocument,
} from "../models/restaurant.model.js";
import uploadImageOnCloudinary from "../utils/imageUpload.js";
import { Order } from "../models/order.model.js";
import { type FilterQuery } from "mongoose";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;

    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ user: req.id });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already exists for this user",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const imageUrl = await uploadImageOnCloudinary(file);

    await Restaurant.create({
      user: req.id,
      restaurantName,
      city,
      country,
      deliveryTime: parseInt(deliveryTime),
      cuisines: JSON.parse(cuisines),
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
    });
  } catch (error) {
    console.error("Create restaurant error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id }).populate(
      "menus"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        restaurant: null,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Get restaurant error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;

    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Update fields
    restaurant.restaurantName = restaurantName;
    restaurant.city = city;
    restaurant.country = country;
    restaurant.deliveryTime = parseInt(deliveryTime);
    restaurant.cuisines = JSON.parse(cuisines);

    // Update image if provided
    if (file) {
      const imageUrl = await uploadImageOnCloudinary(file);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRestaurantOrder = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get restaurant orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      status: order.status,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const searchText = req.params.searchText || "";
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = ((req.query.selectedCuisines as string) || "")
      .split(",")
      .filter((cuisine) => cuisine.trim());

    const query: FilterQuery<IRestaurantDocument> = {};

    // Build search conditions
    const searchConditions = [];

    // Search by searchText (from URL parameter)
    if (searchText.trim()) {
      searchConditions.push(
        { restaurantName: { $regex: searchText, $options: "i" } },
        { city: { $regex: searchText, $options: "i" } },
        { country: { $regex: searchText, $options: "i" } }
      );
    }

    // Search by searchQuery (from query parameter)
    if (searchQuery.trim()) {
      searchConditions.push(
        { restaurantName: { $regex: searchQuery, $options: "i" } },
        { cuisines: { $regex: searchQuery, $options: "i" } }
      );
    }

    // Combine search conditions with OR
    if (searchConditions.length > 0) {
      query.$or = searchConditions;
    }

    // Filter by selected cuisines
    if (selectedCuisines.length > 0) {
      query.cuisines = { $in: selectedCuisines };
    }

    const restaurants = await Restaurant.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: restaurants,
      count: restaurants.length,
      searchParams: {
        searchText,
        searchQuery,
        selectedCuisines,
      },
    });
  } catch (error) {
    console.error("Search restaurant error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSingleRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      options: { sort: { createdAt: -1 } },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Get single restaurant error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = ((req.query.selectedCuisines as string) || "")
      .split(",")
      .filter((cuisine) => cuisine.trim());

    const query: FilterQuery<IRestaurantDocument> = {};

    // Apply search query if provided
    if (searchQuery.trim()) {
      query.$or = [
        { restaurantName: { $regex: searchQuery, $options: "i" } },
        { cuisines: { $regex: searchQuery, $options: "i" } },
        { city: { $regex: searchQuery, $options: "i" } },
        { country: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Apply cuisine filters if provided
    if (selectedCuisines.length > 0) {
      query.cuisines = { $in: selectedCuisines };
    }

    const restaurants = await Restaurant.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: restaurants,
      count: restaurants.length,
      filters: {
        searchQuery,
        selectedCuisines,
      },
    });
  } catch (error) {
    console.error("Get all restaurants error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
