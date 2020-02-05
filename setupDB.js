var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var Int32 = require('mongoose-int32');
const { Schema } = mongoose;

const url = 'mongodb://localhost:27017/hotelz';

mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));


const setupUsers = () => {
    // create 4 users
    const userNames = ['Amanuel','Jacob','Sheeba','Messi']
    const userSchema = new Schema({
        username: String,
    });
    const users = mongoose.model('users', userSchema); 
    var userObjects = []
    userNames.map(i=>{
        let user = new users({username:i})
        userObjects.push(user)
    })
    return users.collection.insertMany(userObjects)
}

const hotelIds = []
const setupHotels = ()=>{
    // create 2 hotels
    const hotelDefs = [
        {
            name: 'Hilton Garden Inn Detroit',
            coordinates: [42.3359147,-83.0472385]
        },
        {
            name: 'Hilton Nashville Downtown',
            coordinates: [36.1598862,-86.7794702]
        },
        {
            name: 'New York Hilton Midtown',
            coordinates: [40.7621384,-73.981854]
        }
    ]
    const nestedLocation= new Schema({
        type:String,
        coordinates:Array,
        _id : {id:false}
    })
    
    const hotelSchema = new Schema({
        name: String,
        location: nestedLocation
    })
    
    const hotels = mongoose.model('hotels',hotelSchema)
    let hotelObjects = []
    hotelDefs.map(i=>{
        let hotel = new hotels({
            name:i.name,
            location:{
                type:'point',
                coordinates:i.coordinates
            }
        })
        hotelIds.push(hotel._id)
        hotelObjects.push(hotel)
    })
   return hotels.collection.insertMany(hotelObjects)
}

// create 2 rooms per Hotel
const setupRooms = async () => {
    const roomNumbers = ['10a','10b','10c']
    const roomSchema = new Schema({
        number: String,
        hotel_id: Schema.Types.ObjectId,
        beds: Int32,
        baths: Int32
    })
    const rooms = mongoose.model('rooms',roomSchema)
    const roomObjects = []
    hotelIds.map(id=>{
        roomNumbers.map(roomNumber=>{
            roomObjects.push({
                number:roomNumber,
                hotel_id: mongoose.Types.ObjectId(id),
                beds: 2,
                baths: 1
            })
        })
    })
    return rooms.collection.insertMany(roomObjects)
}

const setupHotelsAndRooms = () => {
    return setupHotels().then(
        setupRooms()
    )
}

const setupReservations = () => {
    const reservationSchema = new Schema({
        guest_id: {type:Schema.Types.ObjectId,required:true},
        room_id: Schema.Types.ObjectId,
        arrival_date: String,
        departure_date: String
    }) 
    // const reservations = mongoose.model('reservations', reservationSchema)
    return mongoose.connection.createCollection('reservations')
}


const setup = async () => {
    await mongoose.connection.dropDatabase()
    let promises = [
        setupReservations(),
        setupUsers(),
        setupHotelsAndRooms()
    ]
    Promise.all(promises).then(()=>{
        mongoose.connection.close()
    })
}

setup()
console.log('hotel ids ',hotelIds)
