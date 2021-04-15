const jwt = require('jsonwebtoken')
const Dashboard = require('../models/admin')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const dashboard = await Dashboard.findOne({_id: decoded._id, 'tokens.token': token})

        if (!dashboard) {
            throw new Error()
        } 

        req.token = token
        req.dashboard = dashboard
        next()

        //console.log(token)
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate!' })
    }
}

module.exports = auth