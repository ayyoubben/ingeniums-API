const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Dashboard = require('../models/admin')

router.post('/dashboard/login', async (req, res) => {
    try {
        const dashboard = await Dashboard.findByCredentials(req.body.email, req.body.password)
        const token = await dashboard.generateAuthToken()
        res.send({dashboard, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/dashboard/logout', auth, async (req, res) => {
    try {
        req.dashboard.tokens = req.dashboard.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.dashboard.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/dashboard/logoutall', auth, async (req, res) => {
    try {
        req.dashboard.tokens = []
        await req.dashboard.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router