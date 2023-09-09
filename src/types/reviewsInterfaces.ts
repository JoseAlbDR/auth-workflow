import { Request } from "express";
import mongoose, { Model } from "mongoose";

export interface IReview {
  rating: number;
  title: string;
  comment: string;
  user: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
  product: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
}

export interface IReviewRequest extends Request {
  body: Omit<IReview, "user">;
}

export interface ReviewModel extends Model<IReview> {
  calculateAverageRating(
    product: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
  ): Promise<void>;
}

export type AggResult = { _id: null; averageRating: number; numOfReviews: 2 };
