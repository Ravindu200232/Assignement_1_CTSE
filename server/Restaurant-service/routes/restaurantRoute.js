import express from 'express'
import { closeShop, createRestaurant, deleteRestaurant, getOne, getRestaurant, isOpen, updateRestaurant, verification } from '../controllers/resturantsController.js';

const restaurantRoute = express.Router();

restaurantRoute.post("/",createRestaurant);
restaurantRoute.get("/",getRestaurant)
restaurantRoute.put("/update/:id",updateRestaurant);
restaurantRoute.delete("/delete/:id",deleteRestaurant);
restaurantRoute.post("/isOpen/:id",isOpen);
restaurantRoute.post("/isClose/:id", closeShop);
restaurantRoute.post("/isVerify/:id",verification)
restaurantRoute.get("/getOne/:id",getOne);


export default restaurantRoute