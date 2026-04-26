const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    bookId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Book",
        required : true
    },
    status : {
        type : String,
        enum : ["reserved","cancelled","completed"],
        default : "waiting"
    }
},{ timestamps : true });

const Reserve = mongoose.model("Reserve",reserveSchema);
module.exports = Reserve;   