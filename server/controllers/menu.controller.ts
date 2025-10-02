import type { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload.js";
import { Menu } from "../models/menu.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import mongoose, { Types } from "mongoose";

// Extend the Express Request interface to include user and id
export type AuthenticatedRequest = Request & {
  user?: any;
  id?: string;
};

export const addMenu = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Upload + create menu
    const imageUrl = await uploadImageOnCloudinary(file);
    const menu = await Menu.create({
      name,
      description,
      price,
      image: imageUrl,
    });

    // Find restaurant linked to user
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (restaurant) {
      (restaurant.menus as Types.ObjectId[]).push(menu._id as Types.ObjectId);
      await restaurant.save();
    }

    return res.status(201).json({
      success: true,
      message: "Menu added successfully",
      menu,
    });
  } catch (error) {
    console.error("Error in addMenu:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// export const addMenu = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     const { name, description, price } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image is required",
//       });
//     }

//     const imageUrl = await uploadImageOnCloudinary(file);
//     const menu = await Menu.create({
//       name,
//       description,
//       price,
//       image: imageUrl,
//     });

//     const restaurant = await Restaurant.findOne({ user: req.id });
//     if (restaurant) {
//       // Use proper type casting
//       restaurant.menus.push(
//         // menu._id as unknown as mongoose.Schema.Types.ObjectId
//         restaurant.menus.push(menu._id as Types.ObjectId);
//       );
//       await restaurant.save();
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Menu added successfully",
//       menu,
//     });
//   } catch (error) {
//     console.error("Error in addMenu:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const editMenu = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const file = req.file;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu ID",
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found!",
      });
    }

    if (name) menu.name = name;
    if (description) menu.description = description;
    if (price) menu.price = price;

    if (file) {
      const imageUrl = await uploadImageOnCloudinary(file);
      menu.image = imageUrl;
    }

    await menu.save();

    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      menu,
    });
  } catch (error) {
    console.error("Error in editMenu:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeMenu = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu ID",
      });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    // Use req.id (from isAuthenticated middleware) instead of req.user
    const restaurant = await Restaurant.findOne({
      user: req.id, // This should be set by your isAuthenticated middleware
      menus: id, // Mongoose can handle string conversion automatically
    });

    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this menu",
      });
    }

    // Remove menu reference from restaurant - use string comparison
    restaurant.menus = restaurant.menus.filter(
      (menuId) => menuId.toString() !== id
    );
    await restaurant.save();

    // Delete the menu itself
    await Menu.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    console.error("Error in removeMenu:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// import type { Request, Response } from "express";
// import uploadImageOnCloudinary from "../utils/imageUpload.js";
// import { Menu } from "../models/menu.model.js";
// import { Restaurant } from "../models/restaurant.model.js";
// import mongoose from "mongoose";

// // Extend the Express Request interface to include user and id
// interface AuthenticatedRequest extends Request {
//   id?: string;
//   user?: any;
// }

// export const addMenu = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     const { name, description, price } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image is required",
//       });
//     }

//     const imageUrl = await uploadImageOnCloudinary(file);
//     const menu = await Menu.create({
//       name,
//       description,
//       price,
//       image: imageUrl,
//     });

//     const restaurant = await Restaurant.findOne({ user: req.id });
//     if (restaurant) {
//       (restaurant.menus as mongoose.Types.ObjectId[]).push(
//         menu._id as mongoose.Types.ObjectId
//       );
//       await restaurant.save();
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Menu added successfully",
//       menu,
//     });
//   } catch (error) {
//     console.error("Error in addMenu:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// export const editMenu = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price } = req.body;
//     const file = req.file;

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid menu ID",
//       });
//     }

//     const menu = await Menu.findById(id);
//     if (!menu) {
//       return res.status(404).json({
//         success: false,
//         message: "Menu not found!",
//       });
//     }

//     if (name) menu.name = name;
//     if (description) menu.description = description;
//     if (price) menu.price = price;

//     if (file) {
//       const imageUrl = await uploadImageOnCloudinary(file);
//       menu.image = imageUrl;
//     }

//     await menu.save();

//     return res.status(200).json({
//       success: true,
//       message: "Menu updated successfully",
//       menu,
//     });
//   } catch (error) {
//     console.error("Error in editMenu:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// export const removeMenu = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid menu ID",
//       });
//     }

//     const menu = await Menu.findById(id);
//     if (!menu) {
//       return res.status(404).json({
//         success: false,
//         message: "Menu not found",
//       });
//     }

//     // Use req.id (from isAuthenticated middleware) instead of req.user
//     const restaurant = await Restaurant.findOne({
//       user: req.id, // This should be set by your isAuthenticated middleware
//       menus: new mongoose.Types.ObjectId(id),
//     });

//     if (!restaurant) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to delete this menu",
//       });
//     }

//     // Remove menu reference from restaurant
//     restaurant.menus = (restaurant.menus as mongoose.Types.ObjectId[]).filter(
//       (menuId) => menuId.toString() !== id
//     );
//     await restaurant.save();

//     // Delete the menu itself
//     await Menu.findByIdAndDelete(id);

//     return res.status(200).json({
//       success: true,
//       message: "Menu deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error in removeMenu:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
