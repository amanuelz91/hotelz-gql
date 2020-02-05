const mongoose = require('mongoose');
var Int32 = require('mongoose-int32');
const { Schema } = mongoose;
const url = 'mongodb://localhost:27017/hotelz';

module.exports.createStore = () => {    
    mongoose.connect(url, { useNewUrlParser: true });
    mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));

    const userSchema = new Schema({
        username: String,
    });

    const users = mongoose.model('users', userSchema); 

    const reservationSchema = new Schema({
        guest_id: {type:Schema.Types.ObjectId,required:true},
        room_id: Schema.Types.ObjectId,
        // arrival_date: {type: Date, required:true},
        arrival_date: String,
        // departure_date: {type: Date, required:true}
        departure_date: String
    })

    const reservations = mongoose.model('reservations', reservationSchema)

    const nestedLocation= new Schema({
        type:String,
        coordinates:Array
    })

    const hotelSchema = new Schema({
        name: String,
        location: nestedLocation
    })

    const hotels = mongoose.model('hotels',hotelSchema)

    const roomSchema = new Schema({
        number: String,
        hotel_id: Schema.Types.ObjectId,
        beds: Int32,
        baths: Int32
    })

    const rooms = mongoose.model('rooms',roomSchema)

    return{
        hotels,
        reservations, 
        rooms,
        users, 
    }
}