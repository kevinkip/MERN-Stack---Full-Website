const allowedOrigins = require('./allowedOrigins')

//3rd party middleware
const corsOptions = { 
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin){
            //if successful
            callback(null, true)
        } else {
            // if failed
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions 