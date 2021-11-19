const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Booking = new Schema(
    {
        user : {
            type : Schema.Types.ObjectId,
            required: true,
            ref : 'user'
        },
        event : {
            type : Schema.Types.ObjectId,
            required : true,
            ref : 'event'
        },
    },
    {timestamps : true}
);

module.exports = mongoose.model("booking",Booking);