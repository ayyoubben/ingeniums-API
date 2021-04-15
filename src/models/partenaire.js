const mongoose = require('mongoose')

const partenaireSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
})

const Partenaire = mongoose.model('Partenaire', partenaireSchema)

module.exports = Partenaire