const { gql } = require('apollo-server');

const typeDefs = gql`

  type User {
    _id: String!
    username: String!
    # reservations: [Reservation]
  }

  type Location {
    longitude: String!
    latitude: String!
  }

  type Hotel {
    id: String!
    name: String!
    location: Location
  }

  type Room {
    id: String!
    number: String!
    beds: Int!
    baths: Int!
    hotel: Hotel
  }

  # type Reservation {
  #   id: String!
  #   guest: User!
  #   arrival_date: String!
  #   departure_date: String!
  #   hotel: Hotel!
  # }

  type Reservation {
    id: String!
    guest: User!
    arrival_date: String!
    departure_date: String!
    room: Room!
  }

  type Query {
    getAllUsers: [User]
    getAllReservations: [Reservation]
    getReservation(id: String): Reservation
    getAllHotels: [Hotel]
    getHotel(id: String): Hotel
    getHotelByRoom(room_id: String):Hotel
  }

  type ReservationUpdateResponse{
    success: Boolean!
    # message: String
    reservation: Reservation
  }

  input ReservationCreator{
    arrival_date: String!
    departure_date: String!
    room_id:String! 
  }

  type Mutation{
    createReservation(input:ReservationCreator):ReservationUpdateResponse!
    # createReservation(input:ReservationCreator):Reservation
  }

`;

module.exports = typeDefs