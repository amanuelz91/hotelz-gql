module.exports = {
    Query:{
        getAllUsers: async (_,{}, {dataSources}) => {
            return dataSources.reservationAPI.getAllUsers()
        },
        getAllReservations: async (_, {}, { dataSources }) => {
            return await dataSources.reservationAPI.getAllReservations()
        },
        getReservation: async (_,{id}, { dataSources }) => {
            let reservation = await dataSources.reservationAPI.getReservationById(id)
            return reservation
        },
        getAllHotels: async (_,{},{ dataSources }) => {
            return await dataSources.reservationAPI.getAllHotels()
        },
        getHotel: async (_,{id},{ dataSources }) => {
            return await dataSources.reservationAPI.getHotelById(id)
        },
        getHotelByRoom: async (_,{room_id},{ dataSources }) => {
            return await dataSources.reservationAPI.getHotelByRoom(room_id)
        }
    },
    Mutation:{
        createReservation: async (_,args,{ dataSources }) => {
            let res = await dataSources.reservationAPI.bookReservation(args.input)
            if(res){
                return {success:true,reservation:res}
            }else{
                return{success:false}
            }
            // console.log
        }
    },
    ReservationUpdateResponse:{
        reservation: async (res,_,{}) => {
            if(res&&res.reservation){
                return res.reservation
            }
        }
    },
    Reservation:{
        guest: async (reservation,_,{dataSources}) => {
            let user = await dataSources.reservationAPI.getUserById(reservation.guest_id)
            return user
        },
        room: async (reservation,_,{dataSources}) => {
            let hotel = await dataSources.reservationAPI.getRoomById(reservation.room_id)
            return hotel
        }
    },
    Room:{
        hotel: async (room,_,{dataSources}) => {
            let hotel = await dataSources.reservationAPI.getHotelById(room.hotel_id)
            return hotel
        }
    },
    Hotel:{
        location: async(hotel,_,{}) => {
            if(hotel&&hotel.location&&hotel.location.coordinates){
                let longitudeBSON = hotel.location.coordinates[0]
                let latitudeBSON = hotel.location.coordinates[1]
                let latitude,longitude;
                if(longitudeBSON&&latitudeBSON){
                     latitude= latitudeBSON.toString()
                     longitude = longitudeBSON.toString()
                     return {longitude,latitude}
                }
                else{
                    return
                }
            }
            else{
                return
            }
        }
    }
}