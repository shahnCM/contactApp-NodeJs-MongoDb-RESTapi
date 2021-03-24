const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = {

    passIfAuthenticated: function(req, res, next) {
        // Get the Token from the header
        const token = req.header('x-auth-token')

        // Check if not token
        if(!token) {
            return res.status(401).json({ msg: 'No token, Authorization denied' })
        }

        try {
            const decoded = jwt.verify(token, config.get('jwtSecret'))

            req.user = decoded.user
            next()

        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' })
        }
    },

    blockIfAuthenticated: function(req, res, next) {
        // Get the Token from the header
        const token = req.header('x-auth-token')
        let tokenIsValid

        // Check if not token
        if(token) {

            try {
                
                tokenIsValid = jwt.verify(token, config.get('jwtSecret'))
                
            } catch (err) {
                
                tokenIsValid = false
            
            }
        }

        if(tokenIsValid) {

            res.status(401).json('Already Singed')
        
        } else {
        
            next()
        
        }

    }    

}