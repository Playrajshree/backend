const Joi = require("joi");

const gameResultValidator = (req, res, next) => {
       const gameResultSchema = Joi.object({
            date: Joi.string().required(),
            time: Joi.string().required(),
            xa: Joi.string().required(),
            xb: Joi.string().required(),
            xc: Joi.string().required(),
            xd: Joi.string().required(),
            xe: Joi.string().required(),
            xf: Joi.string().required(),
            xg: Joi.string().required(),
            xh: Joi.string().required(),
            xi: Joi.string().required(),
            xj: Joi.string().required(),
       })
       const {error, value} = gameResultSchema.validate(req.body);
       if(error){
            return next(error);
       }
       req.body = value;
       next();
}

const currentGameResultsValidator = (req, res, next) => {
       const currentGameResultsSchema = Joi.object({
            date: Joi.string().required().pattern(new RegExp(/^\d{4}-\d{2}-\d{2}$/)).message("date must be in YYYY-MM-DD format"),
       })
       const {error, value} = currentGameResultsSchema.validate(req.query);
       if (error) {
            return next(error);
       }
       req.query = value;
       next();
}

const RangeOfDateGameResultsValidator = (req, res, next) => {
     console.log(req.query);
     const RangeOfDateGameResultsSchema = Joi.object({
          startDate: Joi.string().required().pattern(/^\d{4}-\d{2}-\d{2}$/).message("startDate must be in YYYY-MM-DD format"),
          endDate: Joi.string().required().pattern(/^\d{4}-\d{2}-\d{2}$/).message("endDate must be in YYYY-MM-DD format "),
     })
     const {error, value} = RangeOfDateGameResultsSchema.validate(req.query);
     if (error) {
          return next(error);
     }
     if(new Date(value.startDate) > new Date(value.endDate)) {
          return res.status(400).json({
               message: "start date cannot be after end date",
               status: false,
               statusCode: 400
          })
      }


     req.query = value;
     next();
}


module.exports = {
     gameResultValidator,
     currentGameResultsValidator,
     RangeOfDateGameResultsValidator
};

