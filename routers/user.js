const express = require('express')
const router = new express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

router.post('/', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
    catch(error){
        res.status(400).send(error.message)
    }
})

router.post('/logout', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }
    catch(error){
        res.status(500).send()
    }
})

router.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch (error) {
        res.status(400).send()
    }
})

router.get('/me', auth, (req, res) => {
    res.send(req.user)
})

router.delete('/me', auth, async (req, res) => {
    try{
        await req.user.remove() 
        res.send(req.user)
    }
    catch(error){
        res.status(500).send()
    }
})

router.get('/', (req, res) => {
    res.json("this is the user router")
})


module.exports = router