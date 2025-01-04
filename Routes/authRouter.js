const express= require('express');
const authRouter = express.Router();
const authController = require('../Controller/authController')

  
authRouter.post('/checkAvailability', authController.checkAvailability);  
authRouter.post('/deleteBooking', authController.deleteBooking);  
authRouter.post('/roomCreate', authController.roomCreate);  
authRouter.patch('/bookRoom/:id', authController.bookRoom);
authRouter.get('/bookings',authController.bookings); 

module.exports =authRouter;