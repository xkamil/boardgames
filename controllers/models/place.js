let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Status = require('./status');

let placeSchema = new Schema(
    {
        images: [String],
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
        location: ObjectId,
        tags: [String],
        description: [String],
        likes: [ObjectId],
        status: {type: String, default: Status.active},
    },
    {
        versionKey: false
    }
);


module.exports = mongoose.model('Place', placeSchema);