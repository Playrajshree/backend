const { date } = require("joi");
const gameResult = require("../models/gameResults.model");
const { default: mongoose } = require("mongoose");


const addGameResult = async (req, res, next) => {
      const {
        date, 
        time,
        A11,B12,C13,D14,E15,F16,G17,H18,I19,
      } = req.body;
      const {_id } = req.user
     try {
        const gResult = new gameResult({
            date: new Date(date),
            time,
            creatorId: _id,
            A11,
            B12,
            C13,
            D14,
            E15,
            F16,
            G17,
            H18,
            I19
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
                    A11: 1,
                    B12: 1,
                    C13: 1,
                    D14: 1,
                    E15: 1,
                    F16: 1,
                    G17: 1,
                    H18: 1,
                    I19: 1,
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
          console.log(currentGameResult);
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
     console.log(startDate, endDate);
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



module.exports = {
    addGameResult,deleteGameResult,getGameResults,getCurrentGameResults, getRangeOfGameResults
}