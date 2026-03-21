const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

const {
  isAuthenticated,
  hasRole,
  requireOnboardingComplete
} = require("../middleware/auth.middleware");

const {
  validateCreateEmployee,
  validateChangeEmail,
  validateChangePassword,
  validateUserIdParam
} = require("../middleware/validation.middleware");


router.get(
  "/me",
  isAuthenticated,
  requireOnboardingComplete,
  userController.getMyProfile
);

router.patch(
  "/me/email",
  isAuthenticated,
  requireOnboardingComplete,
  validateChangeEmail,
  userController.changeMyEmail
);

router.patch(
  "/me/password",
  isAuthenticated,
  validateChangePassword,
  userController.changeMyPassword
);


router.get(
  "/team",
  isAuthenticated,
  hasRole("manager", "supervisor"),
  userController.getMyTeam
);



router.get(
  "/",
  isAuthenticated,
  hasRole("admin"),
  userController.getAllUsers
);

router.post(
  "/create",
  isAuthenticated,
  hasRole("admin"),
  validateCreateEmployee,
  userController.createEmployee
);

router.patch(
  "/:id/block",
  isAuthenticated,
  hasRole("admin"),
  validateUserIdParam,
  userController.blockUser
);

router.patch(
  "/:id/unblock",
  isAuthenticated,
  hasRole("admin"),
  validateUserIdParam,
  userController.unblockUser
);

module.exports = router;