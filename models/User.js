const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    createdEvents : [{
        type : Schema.Types.ObjectId,
        ref : 'event'
    }]

})

module.exports = mongoose.model('user',User);