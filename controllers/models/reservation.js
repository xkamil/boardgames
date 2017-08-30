let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reservationSchema = new Schema(
    {
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
        user_id: Schema.Types.ObjectId,
        game_id: Schema.Types.ObjectId,
        reservation_date: Date,
        optional: Boolean,
        home_reservation: Boolean
    },
    {
        versionKey: false
    }
);


module.exports = mongoose.model('Reservation', reservationSchema);