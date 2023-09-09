import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} from "../controllers/reviewController";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";

const router = express.Router();

router
  .route("/")
  .get(getAllReviews)
  .post(authenticateUser, authorizePermissions("user", "admin"), createReview);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, authorizePermissions("user", "admin"), updateReview)
  .delete(
    authenticateUser,
    authorizePermissions("user", "admin"),
    deleteReview
  );

export default router;
