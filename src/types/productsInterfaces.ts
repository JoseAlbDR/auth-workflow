import mongoose from "mongoose";
import { Request } from "express";

export type Category = "office" | "kitchen" | "bedroom";
export type Company = "ikea" | "liddy" | "marcos";

export interface IProduct {
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  company: Company;
  colors: string[];
  featured: boolean;
  freeShipping: boolean;
  inventory: number;
  averageRating: number;
  numOfReviews: number;
  user: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
}

export interface IProductRequest extends Request {
  body: Omit<IProduct, "user">;
}
