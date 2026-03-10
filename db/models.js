const mongoose = require('mongoose')

// Model for a parking item
const parkingSchema = new mongoose.Schema({
    duration: Number,
    licensePlate: String,
    total: Number,    
})

const Parking = mongoose.model("parkings", parkingSchema)


// Model for a user
const userSchema = new mongoose.Schema({
  email: String,
  password: String,  
})
const User = new mongoose.model("users", userSchema)


module.exports = { Parking, User }
