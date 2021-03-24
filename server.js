const express = require('express')
const MongoConfig = require('./config/db')

const app = express()

// Connect DB
MongoConfig.initiateDbConnection()

app.use(express.json( { extended: false } ))
app.use(express.urlencoded( { extended: false } ))

// Define Routes
app.use('/api/users', require('./routes/users'))
app.use('/api/contacts', require('./routes/contacts'))
app.use('/api/auth', require('./routes/auth'))
  
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));