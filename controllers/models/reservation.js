let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Status = require('./status');

let reservationSchema = new Schema(
    {
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
        user_id: Schema.Types.ObjectId,
        reservation_date: Date,
        optional: Boolean
    },
    {
        versionKey: false
    }
);


module.exports = mongoose.model('Reservation', reservationSchema);