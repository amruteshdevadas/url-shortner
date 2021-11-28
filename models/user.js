const mongoose = require ('mongoose');
const userSchema = new mongoose.Schema({

    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    _id:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetPasswordToken: String,
    shortUrl:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShortUrl'
        }
    ]
})

module.exports = mongoose.model('User', userSchema);
