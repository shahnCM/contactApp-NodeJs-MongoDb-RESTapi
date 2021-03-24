const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const { check, validationResult } = require('express-validator')
const AuthMiddleware = require('../middlewares/AuthMiddleware')

// @route   GET api/auth
// @desc    Get Logged in User
// @access  Private
router.get(
    '/user', AuthMiddleware.passIfAuthenticated, 
    (req, res) => AuthController.authenticatedUser(req, res)
)

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
    '/register', [AuthMiddleware.blockIfAuthenticated,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
    ]], 
    async (req, res) => {
        let errors
        
        try {
            errors = await validationResult(req)
        } catch(e) {
            console.error(e.message)
        }
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        return AuthController.registerNewUser(req, res)
    }
)

// @route   POST api/auth
// @desc    Login User & get Token
// @access  Public
router.post(
    '/login', [AuthMiddleware.blockIfAuthenticated, 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ]],
    async (req, res) => {
        let errors
        
        try {
            errors = await validationResult(req)
        } catch(e) {
            console.error(e.message)
        }
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        return AuthController.authenticateUser(req, res)        
    }
)

module.exports = router;