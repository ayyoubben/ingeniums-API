const express = require('express')
const router = new express.Router()
const request = require('request')

router.post('/joinus/',async (req, res) => {
    const email = req.body.email,

    if (!email) {
        return res.status(404).send()
    }

    const options = {
        url: '',
        
    }

    request(options, (err, response, body) => {

    })
})

module.exports = router