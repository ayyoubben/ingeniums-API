const express = require('express')
require('./db/mongoose')

const adminRouter = require('./routers/admin')
const eventRouter = require('./routers/event')
const sponsorRouter = require('./routers/sponsor')
const intermidiateRouter = require('./routers/intermidiate')
const partenaireRouter = require('./routers/partenaire')
const sliderRouter = require('./routers/slider')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(adminRouter)
app.use(eventRouter)
app.use(sponsorRouter)
app.use(intermidiateRouter)
app.use(partenaireRouter)
app.use(sliderRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})