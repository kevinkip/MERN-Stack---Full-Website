require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

//ability to process json. Let our app receive and parse json data
app.use(express.json())

//ability to parse cookies
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))
// telling express where to find the file. This is middleware.
// app.use(express.static('public')) also works.

app.use('/', require('./routes/root'))

// * means all
app.all('*', (req, res) => {
    res.status(404)
    // if the request has an accept-header that is html...
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        // if json request wasn't routed properly, use this response
        res.json({ message: '404 Not Found' })
    } else {
        // sent no matter what if json or html not matched
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
})