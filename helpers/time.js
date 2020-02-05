var mongoose = require('mongoose');

module.exports.returnReservationsInTimeRange = async (arrival_date_ISO, departure_date_ISO, model, room_id) => {
    let documents = await model.aggregate([ 
        {
            $match:{room_id: mongoose.Types.ObjectId(room_id)}
        },
        {
            $match:{
                $or:[
                // case 1
                {
                    $and:[
                    {
                        // a < date_in && date_in < b <= date_out 
                        arrival_date: {
                        // a
                        $gt: arrival_date_ISO
                        }
                    },
                    {
                        arrival_date: {
                        // b
                        $lt: departure_date_ISO
                        },
                        departure_date:{
                        // b
                        $gte: departure_date_ISO
                        }
                    }
                    ]
                },
                // case 2
                {
                    $and:[
                    {
                        // a
                        arrival_date: {
                        $lte: arrival_date_ISO
                        }
                    },
                    {
                        // b
                        departure_date: {
                        $gte: departure_date_ISO
                        }
                    }
                    ]
                },
                // case 3
                {
                    $and:[
                    {
                        // a
                        arrival_date: {
                        $lte: arrival_date_ISO
                        },
                        date_out:{
                            $gt: arrival_date_ISO
                        }
                    },
                    {
                        // b
                        departure_date: {
                        $lt: departure_date_ISO
                        }
                    }
                    ]
                },
                // case 4
                {
                    $and:[
                    {
                        // a
                        arrival_date: {
                        $gte: arrival_date_ISO
                        }
                    },
                    {
                        // b
                        departure_date: {
                        $lt: departure_date_ISO
                        }
                    }
                    ]
                }
                ] 
            }
        }
    ])
    return documents
}