const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dashboardSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
})

dashboardSchema.methods.toJSON = function () {
    const dashboard = this
    const dashboardObject = dashboard.toObject()

    delete dashboardObject.password
    delete dashboardObject.tokens

    return dashboardObject
}

dashboardSchema.methods.generateAuthToken = async function () {
    const dashboard = this
    const token = jwt.sign({_id: dashboard._id.toString()}, process.env.JWT_SECRET)

    dashboard.tokens = dashboard.tokens.concat({ token })

    await dashboard.save()
    return token
}

dashboardSchema.statics.findByCredentials = async (email, password) => {
    const dashboard = await Dashboard.findOne({email})

    if (!dashboard) {
        throw new Error ('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, dashboard.password)

    if (!isMatch) {
        throw new Error ('Unable to login')
    }

    return dashboard
}

dashboardSchema.pre('save', async function(next) {
    const dashboard = this

    if (dashboard.isModified('password')) {
        dashboard.password = await bcrypt.hash(dashboard.password, 8)
    }

    next()
})

const Dashboard = mongoose.model('Dashboard', dashboardSchema)

module.exports = Dashboard