const Room=require('../Model/roomsModel')



const authController = {
    checkAvailability: async (req, res) => {
        try {
          const { from, to,guests } = req.body;
          console.log(from);
           // Destructure 'from' and 'to' from the request body
    
          if (!from || !to || !guests) {
            return res.status(400).json({ message: "All details are mandatory" });
          }
    
          const fromTime = new Date(from);
          console.log(fromTime);
          
          const toTime = new Date(to);
    
          if (fromTime >= toTime) {
            return res.status(400).json({ message: "'From' time must be earlier than 'To' time." });
          }
    
          // Query for rooms that have no overlapping bookings
          const availableRooms = await Room.find({
            $or: [
              { bookings: { $exists: false } }, // No bookings at all
              {
                bookings: {
                  $not: {
                    $elemMatch: {
                      $or: [
                        { from: { $lt: toTime }, to: { $gt: fromTime } }, // Overlaps with the requested timeframe
                      ],
                    },
                  },
                },
              },
            ],
          });
    
          const suitableRooms = availableRooms.filter(room => room.roomCapacity >= guests);

        // If no suitable rooms are available, return an error
        if (suitableRooms.length === 0) {
            return res.status(404).json({ message: "No rooms available for the given guest count." });
        }

        res.status(200).json({
            message: "Available rooms retrieved successfully.",
            availableRooms: suitableRooms, // Return only suitable rooms
        });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
    roomCreate: async(req,res)=>{
        try{
            
            const {roomNumber,floorNumber,roomCapacity,type,payPerHour}=req.body.roomData;
            if(!roomNumber ||!floorNumber ||!roomCapacity ||!type ||!payPerHour) return res.status(400).json({message: "Missing required fields"});
           const room=await Room.findOne({roomNumber:roomNumber,floorNumber:floorNumber})
           if(room) return res.status(400).json({message: "Room already exists"});
            const newRoom=new Room({roomNumber,floorNumber,roomCapacity,type,payPerHour});
            await newRoom.save();
            console.log(newRoom);
            
            res.status(201).json({"Message": "Room created successfully"});
        }
        catch(error){
            res.status(500).json({message: error.message});
            console.log(error);
            
        }
    },
    bookRoom:async(req, res) => {
        try{
            const roomNumber=req.params.id;
            const bookRoom =await  Room.findOne({roomNumber:roomNumber});
            if(!bookRoom) return res.status(404).json({message: "Room not found"});
            
            const {from, to, Name, Email,Phone} = req.body;
            if (!from || !to || !Name || !Email || !Phone) {
                return res.status(400).json({ message: "All fields are required." });
            }
            
            
            
            const bookingData = {
                from,
                to,
                bookedUser: { Name, Email, Phone },
            };
            console.log(bookingData);
            
            bookRoom.bookings.push(bookingData);
            
            await bookRoom.save();
            res.status(200).json({"Message": "Room booked successfully"});

        }
        catch(err){
            res.status(500).json({message: err.message});
            console.log(err);

        }
    },
    bookings:async(req,res)=>{
        try {
            // Fetch all rooms with booking data
            const rooms = await Room.find({}, 'roomNumber floorNumber roomCapacity type bookings');
            
            // Return rooms with their booking data
            res.json(rooms);
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
    },
    deleteBooking:async(req,res)=>{
      try{
        const {room,index}=req.body;
        // console.log(room);
        // console.log(index);
        const roomData=await Room.findById(room._id);
        roomData.bookings.splice(index,1);
        await roomData.save();
        console.log(roomData.bookings[index]);
        res.status(200).json({message: "Room deleted successfully"});
      }
      catch(error){
        res.status(500).json({message: error.message});
        console.log(error);
      }
    }

}

module.exports = authController;