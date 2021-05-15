const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { check, validationResult } = require('express-validator')
const AuthMiddleware = require('../middlewares/AuthMiddleware')

module.exports = router;