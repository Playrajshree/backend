const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
     try {
         const accessToken = req.headers["authorization"]?.replace("Bearer ", "") || req.cookies.accessToken;
         if(!accessToken){
             return res.status(401).json({
                    message: "Access token is missing",
                    status: false,
                    statusCode: 401
             })
         }    
         const publicKeyPath = path.join(process.cwd(), "certs", "publicKey.pem");
         const publicKey = fs.readFileSync(publicKeyPath, "utf-8");
        const decoded = jwt.verify(accessToken, publicKey, {
                algorithms: ["RS256"],
            });
        req.user = decoded;     
        next();
     } catch (error) {
            console.error("Error in authenticateUser", error);
            next(error);
     }
}


const checkRole = (...allowedRoles) => {
      return (req, res, next) => {
           const userRole = req.user.role;
           // If the user's role is not in the allowedRoles array
           if(!allowedRoles.includes(userRole)){
                return res.status(403).json({
                     message: "You are not authorized to access this resource",
                     status:false,
                     statusCode: 403
                })
            }    
           // Role is allowed, proceed
            next();
      }  
}

module.exports = {authenticateUser, checkRole};