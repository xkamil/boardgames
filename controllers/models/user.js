let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        email: String,
        password: String,
        admin: {type: Boolean, default: false},
        deleted: {type: Boolean, default: false},
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
    },
    {
        versionKey: false
    }
);


module.exports = mongoose.model('User', userSchema);