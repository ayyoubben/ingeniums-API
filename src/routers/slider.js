const express = require('express')
const router = new express.Router()
const Event = require('../models/event')
const Intermidiate = require('../models/intermidiate')

router.get('/slider', async (req, res) => {
    /*const twoEvents =  await Event.find({}).sort({"createdAt": -1}).limit(2)
    const twoIntermidiates = await Intermidiate.find({}).sort({"createdAt": -1}).limit(2)
    console.log(twoEvents + twoIntermidiates)*/
    try {
        const twoEvents =  await Event.find({}).sort({"createdAt": -1}).limit(2)
        const twoIntermidiates = await Intermidiate.find({}).sort({"createdAt": -1}).limit(2)
        const slider = twoEvents + twoIntermidiates
        //console.log(twoEvents + twoIntermidiates)
        if(!slider) {
            return res.status(404).send()
        }
        res.send(slider)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports = router