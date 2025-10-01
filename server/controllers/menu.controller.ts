import type { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload.js";
import { Menu } from "../models/menu.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import mongoose from "mongoose";

export const addMenu = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
    const imageUrl = await uploadImageOnCloudinary(file);
    const menu = await Menu.create({
      name,
      description,
      price,
      image: imageUrl,
    });
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (restaurant) {
      (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
      await restaurant.save();
    }

    return res.status(201).json({
      success: true,
      message: "Menu added successfully",
      menu,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const editMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const file = req.file;
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
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const removeMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
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

    // Ensure authenticated user is attached correctly
    const restaurant = await Restaurant.findOne({
      user: req.user?._id || req.id, // depending on how isAuthenticated attaches user
      menus: new mongoose.Types.ObjectId(id),
    });

    if (!restaurant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this menu",
      });
    }

    // Remove menu reference from restaurant
    restaurant.menus = (
      restaurant.menus as mongoose.Schema.Types.ObjectId[]
    ).filter((menuId) => menuId.toString() !== id);
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
// import mongoose, { type ObjectId } from "mongoose";

// export const addMenu = async (req: Request, res: Response) => {
//   try {
//     const { name, description, price } = req.body;
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image is required",
//       });
//     }
//     const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
//     const menu: any = await Menu.create({
//       name,
//       description,
//       price,
//       image: imageUrl,
//     });
//     const restaurant = await Restaurant.findOne({ user: req.id });
//     if (restaurant) {
//       (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
//       await restaurant.save();
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Menu added successfully",
//       menu,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// export const editMenu = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price } = req.body;
//     const file = req.file;
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
//       const imageUrl = await uploadImageOnCloudinary(
//         file as Express.Multer.File
//       );
//       menu.image = imageUrl;
//     }
//     await menu.save();

//     return res.status(200).json({
//       success: true,
//       message: "Menu updated",
//       menu,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
