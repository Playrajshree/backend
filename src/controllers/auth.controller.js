const User = require('../models/auth.model');
const {
  handleHashPassword,
  comparePasswordHandler,
  generateAccessToken,
  generateRefreshToken,
} = require('../utilities/User.util');
const uploadToCloudinary = require("../utilities/cloudinary");



const registerUser = async (req, res, next) => {
  
  try {
    const { userName, email, password, role } = req.body;
    const profilePicturePath = req.file.path;

    if(!profilePicturePath){
         return res.status(400).json({
            message: "profilePicture required",
            status: false,
            statusCode: 400
         })
    }
    const isUserAlreadyExist = await User.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(409).json({
        message: 'User already exist',
        status: false,
        statusCode: 409,
      });
    }
    const hashedPassword = await handleHashPassword(password);
    const cloudinaryResponse = await uploadToCloudinary(profilePicturePath);

    const user = new User({
      userName,
      email,
      password: hashedPassword,
      profilePicture: cloudinaryResponse. secure_url,
      role,
    });
    await user.save();
    
    res.status(201).json({
      message: 'User registered successfully',
      status: false,
      statusCode: 201
    });
  } catch (error) {
    console.error('Error in user registration', error);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User doesn't exit",
        status: false,
        statusCode: 404,
      });
    }

    const isPasswordValid =  await comparePasswordHandler(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Password is invalid',
        status: false,
        statusCode: 401,
      });
    }
    const payload = {
       _id: user._id,
       role: user.role,
       email: user.email,
    }
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const userWithoutPassword = user.toObject(); // convert Mongoose document to plain object
    delete userWithoutPassword.password; 

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24, // 60 minutes
    }) 
    res.cookie("refreshToken", refreshToken, {
       httpOnly: true,
       secure: true,
       sameSite:"none", // when you are on the cross-site need say this none
       maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })
    res.status(200).json({
       message:"User logged in successfully",
       status: true,
       statusCode: 200,
    })
  } catch (error) {
    console.log('Error in login', error);
    next(error);
  }
};

const logoutUser = (req, res, next) => {
     
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
   });
   res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
   });
   res.status(200).json({
       statusCode: 200,
       status: true,
       message: "User logged out successfully"
   })
  } catch (error) {
       console.error('Error in logout', error);
       next(error);
  }
}
const changePassword = async (req, res, next) => {
     const { newPassword } = req.body;
     const { _id } = req.user;
     try {
         const user = await User.findById(_id);
         if(!user){
             return res.status(404).json({
                 message: 'User not found',
                 status: false,
                 statusCode: 404  
             })
         }
         const isSamePassword = await comparePasswordHandler(newPassword, user.password);
         console.log(isSamePassword);
         if(isSamePassword){
             return res.status(409).json({
                  message: 'Password cannot be the same',
                  status: false,
                  statusCode: 409,
             })
         }

         const hashedPassword = await handleHashPassword(newPassword);
         user.password = hashedPassword;
         await user.save({
              validateModifiedOnly: true
         });

         res.status(200).json({
              statusCode: 200,
              status: true,
              message: "Password changed successfully"
         })
     } catch (error) {
         console.log("Error in changePassword", error);
         next(error);
     }
}

const changeEmail = async (req, res, next) => {
         const { newEmail } = req.body;
         const { _id } = req.user;

        try {
            const user = await User.findById(_id);

            if(!user){
                return res.status(404).json({
                      message: "User not found",
                      status: false,
                      statusCode: 404
                })
            }
            console.log(user);
            console.log(user.email === newEmail);
            if(user.email === newEmail){
                 return res.status(409).json({
                      message: "Email is same as last email",
                      status: false,
                      statusCode: 409
                 })
            }
            user.email = newEmail;
            await user.save({
                validateBeforeSave: false
            })

           res.status(200).json({
                 message: "Email changed successfully",
                 status: true,
                 statusCode: 200
           })
        } catch (error) {
             console.error("error in changeEmail", error);
             next(error);
        }
} 

const getUserProfile = async (req, res, next) => {
       const { _id } = req.user;
       try {
           const user = await User.findById(_id);
           if(!user){
               return res.status(404).json({
                    message: "User not found",
                    status: false,
                    statusCode: 404
               })
           }
           res.status(200).json({
                message: "User fetched successfully",
                status: true,
                statusCode: 200,
                data: user
           })        
       } catch (error) {
           console.error("Error in get UserProfile", error);
           next(error);
       }  
}


module.exports = { registerUser, loginUser, logoutUser, changePassword, changeEmail, getUserProfile };
