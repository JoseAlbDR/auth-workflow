import mongoose from "mongoose";
import { IProduct } from "../types/productsInterfaces";

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      maxlength: [100, "Name can not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      required: [true, "Description name is required"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/expample.jpeg",
    },
    category: {
      type: String,
      enum: ["office", "kitchen", "bedroom"],
      required: [true, "Product category is required"],
    },
    company: {
      type: String,
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
      required: [true, "Product company is required"],
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: [true, "Product colors is required"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      min: 0,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (this) {
    await this.$model("Review").deleteMany({ product: this._id });
  }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
