import { Request, Response } from "express";
import { IProduct, IProductRequest } from "../types/productsInterfaces";
import { Product } from "../models/Product";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import fileUpload from "express-fileupload";
import path from "path";

export const createProduct = async (req: IProductRequest, res: Response) => {
  const product: IProduct = { ...req.body, user: req.user.userId };
  const newProduct = await Product.create(product);
  res.status(StatusCodes.OK).json({ product: newProduct });
};

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("reviews");

  if (!product)
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  res.status(StatusCodes.OK).json({ product });
};

export const updateProduct = async (req: IProductRequest, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!product)
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  res.status(StatusCodes.OK).json({ product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product)
    throw new NotFoundError(`Product with id ${req.params.id} not found`);

  await product.deleteOne();
  res.sendStatus(StatusCodes.OK);
};

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.files) throw new BadRequestError("No File Uploaded");

  const image = req.files.image as fileUpload.UploadedFile;

  if (!image.mimetype.startsWith("image"))
    throw new BadRequestError("Please Upload Image");

  const maxSize = 1024 * 1024;

  if (image.size > maxSize)
    throw new BadRequestError("Please Upload Image smaller than 1Mb");

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${image.name}`
  );

  await image.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${image.name}` });
};
