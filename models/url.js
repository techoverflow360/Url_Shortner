const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortid: {
        type: String,
        required: true, 
        unique: true,
    },
    redirectURL: {
        type: String, 
        required: true,
    },
    visitHistory: [ { timestamp: { type: Number }} ],
    // by this we make a reference of user into url 
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    }
}, { timestamps: true }
);

const URL = mongoose.model('url', urlSchema);
module.exports = URL;