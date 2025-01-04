const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
  from: {
    type: Date,
    // required: true,
  },
  to: {
    type: Date,
    // required: true,
  },
  bookedUser:{
    Name:String,
    Email:String,
    Phone:String,
  }
  
 
});

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  floorNumber: {
    type: String,
    enum: ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor'],
    required: true,
  },
  roomCapacity: {
    type: Number,
    required: true,
    min: 1,
  },
  type: {
    type: String,
    enum: ['Deluxe', 'Non-Deluxe'],
    required: true,
  },
  payPerHour: {
    type: Number,
    required: true,
    min: 0,
  },
  
  bookings: [bookingSchema], // Nested schema for booking details
}, {
  timestamps: true,
});

module.exports = mongoose.model('Room', roomSchema, 'Rooms');
