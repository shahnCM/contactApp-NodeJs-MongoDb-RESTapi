const User = require('../models/UserModel')
const Contact = require('../models/ContactModel')
const bcrypt = require('bcryptjs')
const config = require('config')

module.exports = {
 
    create: async function (req, res) {
        const { name, email, phone, type } = req.body

        try {
 
            const newContact = new Contact({
                name,
                email,
                phone,
                type,
                user: req.user.id
            })

            const contact = await newContact.save();
            res.status(201).json(contact)
        
        } catch(error) {

            console.error(error.message)
            res.status(500).send('Server Error')

        }
    },

    read: async function (req, res) {

        if(req.params.id) {
            // Show Specific Contact
            res.status(200).json(`Here is the ID: ${req.params.id}`)
        }

        try {
            
            const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 })
            res.status(200).json(contacts)
        
        } catch(error) {

            console.error(error.message)
            res.status(500).send('Server Error')

        }        

    },

    update: async function (req, res) {

        const { name, email, phone, type } = req.body

        // Build Contact Object
        const contactFields = {}
        if(name) contactFields.name = name
        if(email) contactFields.email = email
        if(phone) contactFields.phone = phone
        if(type) contactFields.type = type

        try {

            let contact = await Contact.findById(req.params.id)
            if(!contact) return res.status(404).json({ msg: 'Contact not Found' })

            // Make Sure User Owns the Contact
            if(contact.user.toString() !== req.user.id) {

                return res.status(401).json({ msg: 'Not Authorized' })

            }

            contact = await Contact.findByIdAndUpdate(req.params.id, 
                { $set: contactFields },
                { new: true }    
            )

            res.status(202).json(contact)

        } catch (error) {

            console.error(error.message)
            res.status(500).send('Server Error')    

        }

    },

    delete: async function (req, res) {

        try {

            let contact = await Contact.findById(req.params.id)
            if(!contact) return res.status(404).json({ msg: 'Contact not Found' })

            // Make Sure User Owns the Contact
            if(contact.user.toString() !== req.user.id) {

                return res.status(401).json({ msg: 'Not Authorized' })

            }

            await Contact.findByIdAndRemove(req.params.id)

            res.status(202).json({ msg: 'Contact Deleted Successfully' })

        } catch (error) {

            console.error(error.message)
            res.status(500).send('Server Error')    

        }        

    }

}