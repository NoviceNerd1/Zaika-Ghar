import mongoose, { Document } from "mongoose";

export interface IRestaurant {
  user: mongoose.Schema.Types.ObjectId;
  restaurantName: string;
  city: string;
  country: string;
  deliveryTime: number;
  cuisines: string[];
  imageUrl: string;
  menus: mongoose.Schema.Types.ObjectId[];
  rating?: number; // optional: useful for sorting later
  isOpen?: boolean; // optional: filter by open/closed status
}

export interface IRestaurantDocument extends IRestaurant, Document {
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new mongoose.Schema<IRestaurantDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      index: true, // improves search performance
    },
    country: {
      type: String,
      required: true,
      index: true,
    },
    deliveryTime: {
      type: Number,
      required: true,
      min: 1,
    },
    cuisines: [
      {
        type: String,
        required: true,
        index: true, // needed for your `$in` cuisine filter
      },
    ],
    menus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    imageUrl: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ Add a compound text index for fast search across name/cuisines/city/country
restaurantSchema.index({
  restaurantName: "text",
  cuisines: "text",
  city: "text",
  country: "text",
});

// Optional: frequently used query optimization
restaurantSchema.index({ createdAt: -1 });

export const Restaurant = mongoose.model<IRestaurantDocument>(
  "Restaurant",
  restaurantSchema
);
