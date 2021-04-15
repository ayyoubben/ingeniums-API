const express = require('express')
const router = new express.Router()
const Partenaire = require('../models/partenaire')
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
router.post('/partenaires', auth, upload.single('imageUrl'),async (req, res) => {
    const file = req.file

    if(!file) {
        res.status(400).send()
    }
    const partenaire = new Partenaire({
        ...req.body,
        imageUrl: file.path
    })

    try {
        await partenaire.save()
        res.status(201).send(partenaire)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get partenaire to edit it
router.get('/partenaires/:name', auth, async (req, res) => {
    const name = req.params.name
    try {
        const partenaire = await Partenaire.find({name})
        if (!partenaire) {
            return res.status(404).send()
        }
        res.send(partenaire)
    }catch (e) {
        res.status(500).send()
    }
})

router.patch('/partenaires/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'imageUrl']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update) )

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try {
        const partenaire = await Partenaire.findOne({_id})

        if (!partenaire) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => partenaire[update] = req.body[update] )
        await partenaire.save()

        res.send(partenaire)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/partenaires/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const partenaire = await Partenaire.findOneAndDelete({_id})
        if (!partenaire) {
            return res.status(404).send()
        }
        res.send(partenaire)
    } catch (e) {
        res.status(500).send()
    }
})

//get partenaires to show them to visitors
router.get('/partenaires', async (req, res) => {
    try {
        const partenaires = await Partenaire.find({})
        if (!partenaires) {
            return res.status(404).send()
        }
        res.send(partenaires)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports = router