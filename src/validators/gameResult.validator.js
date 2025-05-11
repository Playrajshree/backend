const Joi = require("joi");
const gameResultValidator = (req, res, next) => {
       const gameResultSchema = Joi.object({
            date: Joi.string().required(),
            time: Joi.string().required(),
            A10: Joi.number().required().min(1).max(99),
            B11: Joi.number().required().min(1).max(99),
            C12: Joi.number().required().min(1).max(99),
            D13: Joi.number().required().min(1).max(99),
            E14: Joi.number().required().min(1).max(99),
            F15: Joi.number().required().min(1).max(99),
            G16: Joi.number().required().min(1).max(99),
            H17: Joi.number().required().min(1).max(99),
            I18: Joi.number().required().min(1).max(99),
            J19: Joi.number().required().min(1).max(99),
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
const updateResultValidator = (req, res, next) => {
      const updateResultSchema = Joi.object({
           id: Joi.string().required(),
           cell: Joi.string().required().max(2).valid('A10', 'B11', 'C12', 'D13', 'E14', 'F15', 'G16', 'H17', 'I18', 'J19'),
           cellValue: Joi.number().required().min(1).max(99)
      })
      const {error, value} = updateResultSchema.validate(req.body);
      if(error){
          return next(error);
      }
      req.body = value;
      next();
}


module.exports = {
     gameResultValidator,
     currentGameResultsValidator,
     RangeOfDateGameResultsValidator,
     updateResultValidator
};

