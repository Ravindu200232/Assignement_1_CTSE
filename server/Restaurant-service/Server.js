import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './DbConnection.js';
import jwt, { decode } from "jsonwebtoken"
import restaurantRoute from './routes/restaurantRoute.js';
import collectionRoute from './routes/collectionRoute.js';
import cors from 'cors'
import reviewRouter from './routes/reviewRouter.js';

dotenv.config();

const app = express();

app.use(cors())

app.use(bodyParser.json());

app.use((req,res,next)=>{
    let token = req.header
    ("Authorization")

    if(token!=null){
        token = token.replace("Bearer ","");
        jwt.verify(token,process.env.SEKRET_KEY,
            (err,decode)=>{
                if(!err){
                    req.user = decode;
                }
            }
        );
    }
    next()

});

connectToDatabase();

app.use("/api/v1/restaurant",restaurantRoute)
app.use("/api/v1/collection",collectionRoute)
app.use("/api/v1/reviews",reviewRouter)



app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})


