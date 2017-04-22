let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Status = require('./status');

let placeSchema = new Schema(
    {
        images: [Schema.Types.ObjectId],
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
        location: Schema.Types.ObjectId,
        user_id: Schema.Types.ObjectId,
        tags: [String],
        description: [String],
        likes: [Schema.Types.ObjectId],
        status: {type: String, default: Status.draft},
    },
    {
        versionKey: false
    }
);


module.exports = mongoose.model('Place', placeSchema);