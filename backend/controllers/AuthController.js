const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = {

    authenticatedUser: async function (req, res) {

        try {

            const user = await User.findById(req.user.id).select('-password')
            
            res.json(user)

        } catch (err) {

            console.error(err.message)
            res.status(500).send("Internal Server Error")
            
        }

    },

    registerNewUser: async function(req, res) {

        const {name, email, password} = req.body
        
        let user
        let userToken

        try {
            user = await User.findOne({ email })

            if(user) {
                return res.status(400).json({ msg: 'User already exists with this Email' });
            }

            user = new User({
                name,
                email,
                password
            })

            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(password, salt)

            await user.save();  

            const payload = {
                user: {
                    id:     user.id,
                    email:  user.email,
                }
            }

            // Sync
            userToken = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 })
            
            // Async
            // jwt.sign(payload, config.get('jwtSecret'), { 
            //     expiresIn: 360000 
            // }, (err, asyncToken) => {
            //     if(err) 
            //         throw err
                
            //     console.log(asyncToken)
            // })

        } catch(error) {
            res.status(500).json({ 
                msg: 'User Registration Unsuccessful',
                error: error
             })
        }

        res.status(201).json({ 
            msg:    'User Registration Successful',
            user:   user,
            token:  userToken
         })
    },

    authenticateUser: async function(req, res) {
        
        const {email, password} = req.body
        
        let user
        let userToken

        try {
            user = await User.findOne({ email })

            if(!user) {
                return res.status(400).json({ msg: 'Email or Password is Wrong!' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res.status(400).json({ msg: 'Email or Password is Wrong!' });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            // Sync
            userToken = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 })

        } catch(error) {
            res.status(500).json({ 
                msg: 'User Login Unsuccessful',
                error: error
             })
        }

        res.status(200).json({ 
            msg:    'User Registration Successful',
            user:   user,
            token:  userToken
         })        
    }

}