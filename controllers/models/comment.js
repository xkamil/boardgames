let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Status = require('./status');

let commentSchema = new Schema(
    {
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
        user_id: Schema.Types.ObjectId,
        place_Id: Schema.Types.ObjectId,
        comment: String,
        status: {type: String, default: Status.active}
    },
    {
        versionKey: false
    }
);


module.exports = mongoose.model('Comment', commentSchema);