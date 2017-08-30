let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let gameSchema = new Schema(
    {
        name: String,
        link: String,
        players_min: Number,
        players_max: Number,
        complexity: Number,
        playing_time: Number,
        home_reservation: Boolean
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Game', gameSchema);