const express = require('express');
const router = express.Router()
const JWT = require('jsonwebtoken')
const User = require('../../modals/user')
const { JWT_SECRET } = require('../../config/applicationSecret')
const passport = require('passport');
const { tokenAuthJwt, tokenAuthLocal, generateToken } = require('../../config/auth')


router.post('/signUp', async (req, res) => {
    const { email, password } = req.body
    const newUser = new User(req.body)
    const foundUser = await User.findOne({ email })
    if (foundUser) {
        return res.status(403).json({ error: "user is already exist" })
    }
    await newUser.save((err, user) => {
        res.send({ "success": "roomies saved successfully" })
    })
})


router.get('/getAllUser', tokenAuthJwt, async (req, res) => {
    const allUser = await User.find()
    res.json(allUser)
})

router.post('/token', tokenAuthLocal, async (req, res) => {
    const token = generateToken.getToken(req.user)
    res.json({ message: "sign in successFull", token })
})

router.get('/me', tokenAuthJwt, async (req, res) => {
    res.json(req.user)
})

module.exports = router;