let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        name: String,
        password: String,
        admin: {type: Boolean, default: false},
        deleted: {type: Boolean, default: false}
    },
    {
        versionKey: false
    }
);


module.exports = mongoose.model('User', userSchema);