const express = require('express')
const router = new express.Router()
const Event = require('../models/event')
const auth = require('../middleware/auth')
const multer = require('multer')
const fs = require('fs')
//const sharp = require('sharp')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir('./uploads/',(err)=>{
        cb(null, './uploads/')
        })
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
router.post('/events', auth, upload.array('imagesUrl', 10), async (req, res) => {
    const files = req.files
    let i = 0
    console.log(files)
    const filesPath = []
    files.forEach(file => {
        filesPath[i] = file.path
        i++
    })
    //console.log(filesPath)
    if(!filesPath) {
        return res.status(400).send()
    }

    const event = new Event({
        ...req.body,
        imagesUrl: filesPath
    })

    try {
        await event.save()
        res.status(201).send(event)
    } catch (e) {
        res.status(400).send(e)
    }
})
/*
router.post('/events/images', auth, upload.array('imagesUrl', 10), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().toBuffer()
    
    req.event.imagesUrl = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})
*/
//get event to edit it
router.get('/events/:title', auth, async (req, res) => {
    const title = req.params.title
    try {
        const event = await Event.find({title})
        if (!event) {
            return res.status(404).send()
        }
        res.send(event)
    }catch (e) {
        res.status(500).send()
    }
})

router.patch('/events/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'date', 'imagesUrl', 'article']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update) )

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try {
        const event = await Event.findOne({_id})

        if (!event) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => event[update] = req.body[update] )
        await event.save()

        res.send(event)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/events/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const event = await Event.findOneAndDelete({_id})
        if (!event) {
            return res.status(404).send()
        }
        res.send(event)
    } catch (e) {
        res.status(500).send()
    }
})

//get events to show them to visitors
router.get('/events', async (req, res) => {
    try {
        const events = await Event.find({})
        if (!events) {
            return res.status(404).send()
        }
        res.send(events)
    }catch (e) {
        res.status(500).send()
    }
})

module.exports = router