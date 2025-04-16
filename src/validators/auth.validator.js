const Joi = require('joi');

const registerUserValidator = (req, res, next) => {
  const registerSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .max(12)
      .required()
      .pattern(
        new RegExp(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
      ),
    role: Joi.string().required().valid('admin'),
  });

  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  req.body = value;
  return next();
};


const loginValidator = (req, res, next) => {
     const loginValidatorSchema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().pattern(new RegExp( /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required()
     })
      const {error, value} = loginValidatorSchema.validate(req.body);
      if(error){
         return next(error);
      }
      req.body = value;
      return next();
}

const changePasswordValidator =  (req, res, next)  => {
  const changePasswordSchema = Joi.object({
    newPassword: Joi.string().pattern(new RegExp( /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required()
  })

  const { error, value } = changePasswordSchema.validate(req.body);
  if(error){
      return next(error);
  }
  req.body = value;
  return next(); 
}

const changeEmailValidator = (req, res, next) => {
      const changeEmailSchema = Joi.object({
           newEmail: Joi.string().email().required()
      })

      const {error, email} = changeEmailSchema(req.body);
      if(error){
           return next(error);
      }

      req.body = value;
      return next();

}



module.exports = { registerUserValidator, loginValidator, changePasswordValidator, changeEmailValidator };
