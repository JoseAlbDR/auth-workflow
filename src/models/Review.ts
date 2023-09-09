import mongoose from "mongoose";
import { AggResult, IReview, ReviewModel } from "../types/reviewsInterfaces";

const ReviewSchema = new mongoose.Schema<IReview, ReviewModel>(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Plase provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide title"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "Please provide review text"],
      maxlength: [1000, "Title cannot exceed 1000 characters"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.post("save", async function () {
  await Review.calculateAverageRating(this.product);
});

ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await Review.calculateAverageRating(this.product);
  }
);

ReviewSchema.static(
  "calculateAverageRating",
  async function calculateAverageRating(
    this,
    product: mongoose.Types.ObjectId
  ) {
    const result: AggResult[] = await this.aggregate([
      { $match: { product } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          numOfReviews: { $sum: 1 },
        },
      },
    ]);
    await mongoose.model("Product").findOneAndUpdate(
      { _id: product },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  }
);

export const Review = mongoose.model<IReview, ReviewModel>(
  "Review",
  ReviewSchema
);
