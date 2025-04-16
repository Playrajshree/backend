const express = require('express');
const { registerUserValidator, loginValidator, changePasswordValidator, changeEmailValidator } = require('../validators/auth.validator');
const { registerUser, loginUser, logoutUser, changePassword, changeEmail, getUserProfile } = require('../controllers/auth.controller');
const upload = require('../middlewares/upload.middleware');
const { authenticateUser } = require("../middlewares/auth.middleware");
const authRouter = express.Router();

authRouter.post(
  '/register',
  upload.single('profilePicture'),
  registerUserValidator,
  registerUser
);

authRouter.post("/login", 
  loginValidator, 
  loginUser
);


authRouter.post("/logout", authenticateUser, 
  logoutUser
);


authRouter.patch("/change-password", authenticateUser, changePasswordValidator, 
  changePassword
);
  
authRouter.patch("/change-email", authenticateUser, changeEmailValidator, changeEmail)
authRouter.get("/get-profile", authenticateUser, getUserProfile)


module.exports = authRouter;
