const { DataSource } = require('apollo-datasource');
var mongoose = require('mongoose');
const {returnReservationsInTimeRange} = require('../helpers');

class ReservationAPI  extends DataSource{
    constructor({ store }) {
        super()
        this.store = store
    }
    
    initialize(config) {
        this.context = config.context
    }

    async getAllUsers(){
        try{
            const users = await this.store.users.find({}).exec()
            return users
        }catch(e){
            return
        }
    }
    
    async getUserById(userId){
        try{
            const user = await this.store.users.findById(userId).exec()
            return user
        }catch(e){
            return 
        }
    }

    async bookReservation({room_id,arrival_date,departure_date}){
        try{
            let arrival_date_ISO = arrival_date
            let departure_date_ISO = departure_date
            if(arrival_date_ISO >= departure_date_ISO){
                return false
            }
            const userId = this.context.user.id
            let reservations =  this.store.reservations
            var newReservation = new reservations({
                guest_id: mongoose.Types.ObjectId(userId),
                room_id: mongoose.Types.ObjectId(room_id),
                arrival_date: arrival_date_ISO,
                departure_date: departure_date_ISO,
            })
            const room = await this.store.rooms.findById(room_id)
            if(!room){
                return false
            }
            const existingReservations = await returnReservationsInTimeRange(arrival_date_ISO,departure_date_ISO,this.store.reservations,room_id)
            if(existingReservations.length !== 0){
                return false
            }
            let newRes = await newReservation.save()
            return newRes
        }catch(error){
            return false
        }
    }

    async getAllReservations(){
        try{
            const reservations = await this.store.reservations.find({}).exec()
            return reservations
        }catch(e){
            return
        }
    }

    async getReservationById(id){
        try{
            const reservation = await this.store.reservations.findById(id)
            return reservation
        }catch(e){
            return
        }
    }

    async getAllHotels(){
        try{
            const hotels = await this.store.hotels.find({}).exec()
            return hotels
        }catch(e){
            return
        }
    }

    async getHotelById(id){
        try{
            const hotel = await this.store.hotels.findById(id).exec()
            return hotel
        }catch(e){
            return
        }
    }

    
    async getRoomById(id){
        try{
            const room = await this.store.rooms.findById(id).exec()
            return room
        }catch(e){
            return
        }
    }
    
    async getHotelByRoom(room_id){
        try{
            const room = await this.getRoomById(room_id)
            if(room&&room.hotel_id){
                const hotel = await this.getHotelById(room.hotel_id)
                return hotel
            }
            return 
        }catch(e){
            return
        }
    }
}

module.exports.ReservationAPI = ReservationAPI