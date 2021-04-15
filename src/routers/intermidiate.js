const express = require('express')
const router = new express.Router()
const Intermidiate = require('../models/intermidiate')
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
router.post('/intermidiates', auth, upload.array('imagesUrl', 10), async (req, res) => {
    const files = req.files
    let i = 0
    //console.log(files)
    const filesPath = []
    files.forEach(file => {
        filesPath[i] = file.path
        i++
    })

    if(!filesPath) {
        return res.status(400).send()
    }

    const intermidiate = new Intermidiate({
        ...req.body,
        imagesUrl: filesPath
    })

    try {
        await intermidiate.save()
        res.status(201).send(intermidiate)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get intermidiate to edit it
router.get('/intermidiates/:title', auth, async (req, res) => {
    const title = req.params.title
    try {
        const intermidiate = await Intermidiate.find({title})
        if (!intermidiate) {
            return res.status(404).send()
        }
        res.send(intermidiate)
    }catch (e) {
        res.status(500).send()
    }
})

router.patch('/intermidiates/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'date', 'imagesUrl', 'article']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update) )

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try {
        const intermidiate = await Intermidiate.findOne({_id})

        if (!intermidiate) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => intermidiate[update] = req.body[update] )
        await intermidiate.save()

        res.send(intermidiate)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/intermidiates/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const intermidiate = await Intermidiate.findOneAndDelete({_id})
        if (!intermidiate) {
            return res.status(404).send()
        }
        res.send(intermidiate)
    } catch (e) {
        res.status(500).send()
    }
})

//get intermidiates to show them to visitors
router.get('/intermidiates', async (req, res) => {
    try {
        const intermidiates = await Intermidiate.find({})
        if (!intermidiates) {
            return res.status(404).send()
        }
        res.send(intermidiates)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports = router