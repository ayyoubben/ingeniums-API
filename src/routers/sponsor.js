const express = require('express')
const router = new express.Router()
const Sponsor = require('../models/sponsor')
const auth = require('../middleware/auth')
const multer = require('multer')
const fs = require('fs')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    },
})

const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)/)) {
        return cb(new Error('File must be image!'))
    }

    cb(undefined, true)
}

const upload = multer({storage: storage, fileFilter: fileFilter})

//Dashboard functions
router.post('/sponsors', auth, upload.single('imageUrl'), async (req, res) => {
    const file = req.file
    
    if(!file) {
        res.status(400).send()
    }
    const sponsor = new Sponsor({
        ...req.body,
        imageUrl: file.path
    })

    try {
        await sponsor.save()
        res.status(201).send(sponsor)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get sponsor to edit it
router.get('/sponsors/:name', auth, async (req, res) => {
    const name = req.params.name
    try {
        const sponsor = await Sponsor.find({name})
        if (!sponsor) {
            return res.status(404).send()
        }
        res.send(sponsor)
    }catch (e) {
        res.status(500).send()
    }
})

router.patch('/sponsors/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'imageUrl']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update) )

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try {
        const sponsor = await Sponsor.findOne({_id})

        if (!sponsor) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => sponsor[update] = req.body[update] )
        await sponsor.save()

        res.send(sponsor)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/sponsors/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const sponsor = await Sponsor.findOneAndDelete({_id})
        if (!sponsor) {
            return res.status(404).send()
        }
        res.send(sponsor)
    } catch (e) {
        res.status(500).send()
    }
})

//get sponsors to show them to visitors
router.get('/sponsors', async (req, res) => {
    try {
        const sponsors = await Sponsor.find({})
        if (!sponsors) {
            return res.status(404).send()
        }
        res.send(sponsors)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports = router