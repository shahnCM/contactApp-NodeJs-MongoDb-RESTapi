const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

module.exports = {

    initiateDbConnection: function() {

        mongoose
        .connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then(() => console.log("Mongo Connected"))
        .catch(err => {
            console.error(err.message)
            process.exit(1)
        })

    }
    
}
