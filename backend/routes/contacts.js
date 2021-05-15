const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const ContactController = require('../controllers/ContactController')
const AuthMiddleware = require('../middlewares/AuthMiddleware')

// @route   GET api/contacts/:id(optional)
// @desc    Get selected user contact
// @access  Private
router.get(
    '/:id?', AuthMiddleware.passIfAuthenticated,
    async (req, res) => await ContactController.read(req, res)
)

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post(
    '/', [AuthMiddleware.passIfAuthenticated, 
    [
        check('name', 'Name is required').not().isEmpty()
    ]],
    async (req, res) => {
        try {
            const errors = await validationResult(req)
        
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
        }
        catch (e) {
            console.error(e.message)
        }

        return ContactController.create(req, res)
    }
)

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put(
    '/:id', [AuthMiddleware.passIfAuthenticated],
    (req, res) => ContactController.update(req, res)
)

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete(
    '/:id', [AuthMiddleware.passIfAuthenticated],
    (req, res) => ContactController.delete(req, res)
)

module.exports = router;