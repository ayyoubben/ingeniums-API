const mongoose = require('mongoose')

const intermidiateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    imagesUrl: [{
        type: String,
        required: true
    }],
    article: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

const Intermidiate = mongoose.model('Intermidiate', intermidiateSchema)

module.exports = Intermidiate