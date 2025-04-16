const User = require('../models/auth.model');
const {
  handleHashPassword,
  comparePasswordHandler,
  generateAccessToken,
  generateRefreshToken,
} = require('../utilities/User.util');



const registerUser = async (req, res, next) => {
  const { userName, email, password, role } = req.body;
  const profilePicture = req.file.path;

  try {
    const isUserAlreadyExist = await User.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(409).json({
        message: 'User already exist',
        status: false,
        statusCode: 409,
      });
    }
    const hashedPassword = handleHashPassword(password);
    const user = new User({
      userName,
      email,
      password: hashedPassword,
      profilePicture,
      role,
    });
    await user.save();
    res.status(201).json({
      message: 'User registered successfully',
      status: 201,
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
      return res.status().json({
        message: "User doesn't exit",
        status: false,
        statusCode: 404,
      });
    }

    const isPasswordValid = comparePasswordHandler(password, user.password);
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
        maxAge: 1000 * 60 * 60, // 60 minutes
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
      sameSite: "strict",
   });
   res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
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
         const isSamePassword = comparePasswordHandler(newPassword, user.password);
         if(isSamePassword){
             return res.status(409).json({
                  message: 'Password cannot be the same',
                  status: false,
                  statusCode: 409,
             })
         }

         const hashedPassword = handleHashPassword(changePassword);
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
            const isEmailSame = user.email === newEmail;
            if(isEmailSame){
                 return res.status(409).json({
                      message: "Email is same as last email",
                      status: false,
                      statusCode: 409
                 })
            }
            user.email = changeEmail;
            await user.save({
                 validateModifiedOnly: true
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
