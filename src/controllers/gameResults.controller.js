const { date } = require("joi");
const gameResult = require("../models/gameResults.model");
const { default: mongoose } = require("mongoose");


const addGameResult = async (req, res, next) => {
      const {
        date, 
        time,
        A10,B11,C12,D13,E14,F15,G16,H17,I18,J19
      } = req.body;
      console.log(req.body);
      const {_id } = req.user
     try {
        const gResult = new gameResult({
            date: new Date(date),
            time,
            creatorId: _id,
            A10,
            B11,
            C12,
            D13,
            E14,
            F15,
            G16,
            H17,
            I18,
            J19
          });
          await gResult.save()
    
          res.status(200).json({
                message: "Game Result Added Successfully",
                status: true,
                statusCode: 200
          })
     } catch (error) {
         console.error("Error in addGameResult", error);
         next(error);
     }
}

const deleteGameResult = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id) {

            return res.status(400).json({
                message: "Please provide id",
                status: false,
                statusCode: 400
            })    
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
              return res.status(400).json({
                  message: "Invalid ID format.",
                  status: false,
                  statusCode: 400
              })  
         } 
        const gResult = await gameResult.findByIdAndDelete(id);        
        if(!gResult){
            return res.status(404).json({
                message: "Game Result Not Found",
                status: false,
                statusCode: 404
            })
        }

        res.status(200).json({
            message: "Game Result Deleted Successfully",
            status: true,
            statusCode: 200
        })
        
    } catch (error) {
        console.error("error in deleteGameResult", error);
        next(error);
    }   
}
const getGameResults = async (req, res, next) => {
      
    try {
       const results = await gameResult.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "creatorId",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            {
                $unwind: "$creator"
            },
            {
                $project:{
                    _id:1,
                    date: 1,
                    time: 1,
                    A10: 1,
                    B11: 1,
                    C12: 1,
                    D13: 1,
                    E14: 1,
                    F15: 1,
                    G16: 1,
                    H17: 1,
                    I18: 1,
                    J19: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    creator: {
                        _id: 1,
                        userName:1,
                        email:1,
                        profilePicture:1                    }                                   
                }
            }
       ]);
        if(results.length === 0){
            return res.status(404).json({
                message: "No Game Results Found",
                status: false,
                statusCode: 404
            })
        }
        res.status(200).json({
            message: "Game Results Retrieved Successfully",
            status: true,
            statusCode: 200,
            data: results
        })
        
    } catch (error) {
         console.error("error in getGameResults", error);
         next(error);
    }

}
const getCurrentGameResults = async (req, res, next) => {
      const { date } =  req.query;
      try {
          const currentGameResult = await gameResult.find({date});
          if(currentGameResult.length === 0){
             return res.status(404).json({
                message: "No Game Result Found",
                status: false,
                statusCode: 404
             })
          }
          res.status(200).json({
            message: "Current Game Result Found",
            status: true,
            statusCode: 200,
            data: currentGameResult
          })  
      } catch (error) {
          console.error("error in getCurrentGamesResults", error);
          next(error);
}
}

const getRangeOfGameResults = async (req, res, next) => {
     const {startDate, endDate} = req.query;
     try {
          const gResult = await gameResult.aggregate([{
            $match: {
                 "date":{
                      $gte: new Date(startDate),
                      $lte: new Date(endDate)
                 }
            }
        },  
          ])
          if(gResult.length === 0){
               return res.status(404).json({
                message: "No Game Result Found",
                status: false,
                statusCode: 404
               })
          }
          res.status(200).json({
            message: "Game Result Found",
            status: true,
            statusCode: 200,
            data: gResult
          })
        
     } catch (error) {
          console.error("error in getRangeofGameResults", error);
          next(error);
     }
}


const updateResult = async (req, res, next) => {
     try {
         const {id, cell, cellValue} = req.body;
         const updateResult = await gameResult.findById(id);
         if(!updateResult){
             return res.status(404).json({
                message: "Game Result Not Found",
                status: false,
                statusCode: 404
             })
         }    
         updateResult[cell] = cellValue;
         const updatedResult = await updateResult.save({
            validateBeforeSave: false
         });
         res.status(200).json({
            message: "Game Result Updated",
            status: true,
            statusCode: 200,
            data: updatedResult
         })
     } catch (error) {
         console.error("Error in updateResult: ", error);
         next(error);
     }
}

module.exports = {
    addGameResult,deleteGameResult,getGameResults,getCurrentGameResults, getRangeOfGameResults, updateResult
}